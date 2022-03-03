const model = require('../models/user');

exports.isUser = (req, res, next)=>{
    if(!req.session.user){
        return null;
    } else{
        return req.session.user.firstName + " " + req.session.user.lastName;
    }
};