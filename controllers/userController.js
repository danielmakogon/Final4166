const model = require('../models/user');
const Connection = require('../models/connection');
const{validationResult} = require('express-validator');
const flash = require('connect-flash');


exports.new = (req, res)=>{
    return res.render('./users/new');    
};

exports.create = (req, res, next)=>{

    
        let user = new model(req.body);//create a new story document
        if(user.email){
            user.email = user.email.toLowerCase();
        }
        user.save()//insert the document to the database
        .then(user=>{
                res.redirect('/users/login');  
        }) 
        .catch(err=>{
            if(err.name === 'ValidationError' ) {
                req.flash('error', err.message);  
                return res.redirect('/users/new');
            }
    
            if(err.code === 11000) {
                req.flash('error', 'Email has been used');  
                return res.redirect('/users/new');
            }
            
            next(err);
        }); 
    

    //res.send('Created a new story');
    
};

exports.getUserLogin = (req, res, next) => {
        return res.render('./users/login');
    
}

exports.login = (req, res, next)=>{
    let email = req.body.email;
    if(email)
        email.toLowerCase();
    let password = req.body.password;
    model.findOne({ email: email })
    .then(user => {
        if (!user) {
            console.log('wrong email address');
            req.flash('error', 'wrong email address');  
            res.redirect('/users/login');
            } else {
            user.comparePassword(password)
            .then(result=>{
                if(result) {
                    req.session.user = user._id;
                    req.session.name = user.firstName + " " + user.lastName;
                    req.flash('success', 'You have successfully logged in');
                    res.redirect('/users/profile');
                } else {
                req.flash('error', 'wrong password');      
                res.redirect('/users/login');
                }
            });     
        }     
    })
    .catch(err => next(err));
};

exports.profile = (req, res, next)=>{
    let id = req.session.user;
    let rsvpEvents = [];
    let rsvpEventData = [];
    model.findById(id)
    .then(user=>{
        rsvpEvents = user.rsvpEvents;
        if (rsvpEvents.length > 0){

            for (let i = 0; i < rsvpEvents.length; i++ ){
            Connection.findById(rsvpEvents[i])
            .then(connection => {  
                rsvpEventData.push(connection);
                Promise.all([model.findById(req.session.user), Connection.find({author: req.session.user})])
                .then(results=>{
                const [user, connections] = results;
                res.render('./users/profile', {user, connections, rsvpEvents, rsvpEventData});
        
                })
            .catch(err=>next(err)); 
            })
            .catch(err=>next(err)); 
            }
        }
        else{
            rsvpEventData = [];
            Promise.all([model.findById(req.session.user), Connection.find({author: req.session.user})])
                .then(results=>{
                const [user, connections] = results;
                res.render('./users/profile', {user, connections, rsvpEventData});
        
                })
            .catch(err=>next(err)); 
        }

    })
    .catch(err=>next(err));
    console.log(rsvpEvents);
    
    //get rsvp event names
    
    
};

// exports.addRSVR = (req, res, next) => {
//     //add code
// }

exports.logout = (req, res, next)=>{
    req.session.destroy(err=>{
        if(err) 
           return next(err);
       else{
            res.redirect('/');   
        }          
    });
   
 };



