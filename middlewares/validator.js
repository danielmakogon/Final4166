const {body} = require('express-validator');
const {validationResult} = require('express-validator');

exports.validateId = (req, res, next)=>{
    let id = req.params.id;
    //an objectId is a 24-bit Hex string
    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid story id');
        err.status = 400;
        return next(err);
    } else {
        return next();
    }
};

exports.validateSignUp = [body('firstName', 'First name cannot be empty').notEmpty().trim().escape(),
body('lastName', 'Last name cannot be empty').notEmpty().trim().escape(),
body('email', 'Email must be a valid email address').isEmail().trim().escape().normalizeEmail(),
body('password', 'Password must be between 8 and 64 characters').isLength({min: 8, max: 64})];

exports.validateLogIn = [
body('email', 'Email must be a valid email address').isEmail().trim().escape().normalizeEmail(),
body('password', 'Password must be between 8 and 64 characters').isLength({min: 8, max: 64})];

exports.validateResult = (req, res, next) => {
    let errors = validationResult(req);
    if(!errors.isEmpty()){
        errors.array().forEach(error=>{
            req.flash('error', error.msg);
        });
        return res.redirect('back');
    } else {
        return next();
    }
};

exports.validateConnection =
    [
        body('title', 'Title is required').notEmpty().escape(),
        body('author', 'Author is required').notEmpty().escape(),
        body('content', 'Content is required').notEmpty().escape(),
        body('title', 'Title is required').notEmpty().escape(),
        body('date', 'Date is required').notEmpty().escape(),
        body('startTime', 'Start time is required').notEmpty().escape(),
        body('endTime', 'End time is required').notEmpty().escape().isLength({min:10})
    ];
