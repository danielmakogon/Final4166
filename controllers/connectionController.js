const model = require('../models/connection');
const User = require('../models/user');
exports.index = (req, res, next)=>{
    let id = req.session.user;
    Promise.all([User.findById(id), model.find()]) 
    .then(results=>{
        const [user, connections] = results;
        res.render('./connection/connections', {user, connections});
    })
    .catch(err=>next(err));
};

exports.contact = (req, res)=>{
    let id = req.session.user;
    User.findById(req.session.user)
    .then(user=>{
        res.render('./general/contact', {user});   
    })
    .catch(err=>next(err));  
    
};

exports.about = (req, res)=>{
    res.render('./general/about')
};

exports.new = (req, res)=>{
    let id = req.session.user;
    User.findById(req.session.user)
    .then(user=>{
        res.render('./connection/newConnection', {user});   
    })
    .catch(err=>next(err)); 
    
};

exports.create = (req, res, next)=>{
    //res.send('Created a new connection');
    let connection = new model(req.body);//create new connection document

    connection.author = req.session.user;
    connection.save()
    .then((connection) => {
        if (connection){
            res.redirect('/connection');   
        } else {  
        res.redirect('back');    
        }
    })
    .catch(err=>{
        if(err.name === 'ValidationError' ) {
            req.flash('error', err.message);  
            return res.redirect('back');
        }
    }); 
};

exports.show = (req, res, next)=>{
    var rsvpEvents = [];
    var rsvpEventData = [];
    User.findById(req.session.user)
    .then(user=>{
        if(user)
            rsvpEvents = user.rsvpEvents;
    })
    .catch(err=>next(err));
    if (rsvpEvents.length > 0){
        model.find({'id': {$in: [rsvpEvents]}})
        .then(results => {
            console.log(results);
            for(let i = 0; i < rsvpEvents.length; i++){
                rsvpEventData.push([results[i].title, rsvpEvents[i]]);
                next();
            }
        })
        .catch(err=>next(err)); 
    }
    let connectionId = req.params.id;
    model.findById(connectionId).populate('author', 'firstName lastName')
    .then(connection=>{
        console.log(connection);
        if(connection){
            let id = req.session.user;
            User.findById(req.session.user)
            .then(user=>{
              res.render('./connection/connection', {connection, user, connectionId, rsvpEventData, rsvpEvents});
            })
            .catch(err=>next(err)); 
            } else{
                let err = new Error('Cannot find a story with id ' + id);
                err.status = 404;
                next(err);
            }
    })
    .catch(err=>next(err));

};

exports.edit = (req, res, next)=>{
    let id = req.params.id;

    if(!id.match(/^[0-9a-fA-F]{24}$/)){
        let err = new Error('Invalid connection ID');
        err.status=400;
        return next(err);
    }

    model.findById(id)
    .then(connection=>{
        if(connection){
            let id = req.session.user;
            User.findById(req.session.user)
            .then(user=>{
              res.render('./connection/editConnection', {connection, user});     
            })
            .catch(err=>next(err));  
            
            } else{
                let err = new Error('Cannot find a story with id ' + id);
                err.status = 404;
                next(err);
            }
    })
    .catch(err=>next(err));
  
};

exports.update = (req, res, next)=>{
    let connection = req.body;
    let id = req.params.id;

    if(!id.match(/^[0-9a-fA-F]{24}$/)){
        let err = new Error('Invalid connection ID');
        err.status=400;
        return next(err);
    }

    model.findByIdAndUpdate(id, connection)
    .then(connection=>{
        if(connection){
            req.flash('success', 'Successfully updated story');
            
                res.redirect('/connection/'+id);   
        }
        else{
            let err = new Error('Invalid connection ID');
            err.status=400;
            next(err);
        }
    })
    .catch(err=>next(err));

};

exports.delete = (req, res, next)=>{
    let id = req.params.id;

    if(!id.match(/^[0-9a-fA-F]{24}$/)){
        let err = new Error('Invalid connection ID');
        err.status=400;
        return next(err);
    }


    model.findByIdAndDelete(id, {useFindAndModify: false})
    .then(connection =>{
        if(connection){
            User.findByIdAndUpdate(req.session.user, {$pull: {rsvpEvents: id}})
            .then(user=>{
                User.find({rsvpEvents: id})
                .then(usersWithRSVPs =>{
                    usersWithRSVPs.forEach(userwithRSVP =>{
                        User.findByIdAndUpdate(userwithRSVP._id, {$pull: {rsvpEvents: id}})
                        .then()
                        .catch(err=>next(err));
                    })

                    req.session.rsvpEvents = user.rsvpEvents;
                    req.flash('success', 'Successfully deleted the story');
                    res.redirect('/users/profile');
                })
                
            })
            .catch(err=>next(err)); 
             
            
        }else{
            let err = new Error('Cannot find a story with id ' + id);
            err.status = 400;
            next(err);
        }
    })
    .catch(err=>next(err));
};

exports.addRSVP = (req, res, next)=> {
    let storyId = req.params.id;
    console.log(req.params.id);
    //validateID here

    User.findByIdAndUpdate(req.session.user, {$push: {rsvpEvents: req.params.id}})
    .then(result=>{
    console.log('RESULTS' + result.rsvpEvents);
    req.flash('success', 'Thank you for your RSVP');
    res.redirect('/users/profile');
    })
    .catch(err=>next(err)); 

};

exports.removeRSVP = (req, res, next)=> {
    let id = req.params.id;
    //validateID here

    User.findByIdAndUpdate(req.session.user, {$pull: {rsvpEvents: id}})
            .then(user=>{
                req.flash('success', 'Successfully removed your RSVP');
                req.session.rsvpEvents = user.rsvpEvents;
                console.log(user.rsvpEvents);   
                res.redirect('/users/profile');
            })
            .catch(err=>next(err)); 

};
