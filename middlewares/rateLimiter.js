const rateLimit = require('express-rate-limit');

exports.logInLimiter = rateLimit({
    windowMs: 60*1000,
    max: 5,
    //message: "Too Many Login Requests. Try Again Later"
    handler: (req,res, next) => {
        let err = new Error('Too Many Login Requests. Try Again Later');
        err.status = 429;
        return next(err);
    }
});