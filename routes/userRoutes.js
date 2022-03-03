const express = require('express');
const {body} = require('express-validator');
const controller = require('../controllers/userController');
const connectionController = require('../controllers/connectionController');
const {isGuest, isLoggedIn} = require('../middlewares/auth');
const { validateSignUp, validateResult, validateLogIn } = require('../middlewares/validator');
const { logInLimiter } = require('../middlewares/rateLimiter');
const router = express.Router();

router.get('/login', isGuest, controller.getUserLogin);

router.post('/login', logInLimiter, isGuest, validateLogIn, controller.login);

router.post('/new', isGuest, validateSignUp, validateResult, controller.create);

router.get('/profile', isLoggedIn, controller.profile);

router.get('/logout', isLoggedIn, controller.logout);

router.get('/new', isGuest, controller.new)

module.exports = router;