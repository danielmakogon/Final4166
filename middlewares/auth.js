const Connection = require('../models/connection')

exports.isGuest = (req, res, next)=>{
    if(!req.session.user){
        console.log('isGuest passed');
        return next();
    } else{
        req.flash('error', 'You are logged in already');
        return res.redirect('/users/profile');
    }
};

exports.isLoggedIn = (req, res, next)=>{
    if(req.session.user){
        return next();
    } else{
        req.flash('error', 'You need to login first');
        return res.redirect('/users/login');
    }
};

exports.isAuthor = (req, res, next)=> {
    let id = req.params.id;
    Connection.findById(id)
    .then(connection=>{
        if(connection){
            if(connection.author == req.session.user){
                return next();
            } else {
                let err = new Error('Unauthorized to access resource');
                err.status = 401;
                return next(err);
            }
        }
    })
    .catch(err=>next(err));  
}