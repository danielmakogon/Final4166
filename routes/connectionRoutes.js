const express = require('express');
const controller = require('../controllers/connectionController');
const {isLoggedIn, isAuthor} = require('../middlewares/auth');
const { validateConnection, validateId } = require('../middlewares/validator');


const router = express.Router();

//GET /stories: send all stories to the user

router.get('/', controller.index);

//GET /connections/new: send html form for creating a new story
router.get('/newConnection', isLoggedIn, controller.new);

//POST /connections: create a new story
router.post('/', isLoggedIn, validateConnection, controller.create);

//GET /connections/:id: send details of story identified by id
router.get('/:id', controller.show);

//GET /connections/:id/edit: send html form for editing an existing story
router.get('/:id/edit', isLoggedIn, isAuthor, controller.edit);

//PUT /connections/:id: update the story identified by id
router.put('/:id', isLoggedIn, isAuthor, controller.update);

//DELETE /connections/:id: delete the story identified by id
router.delete('/:id', isLoggedIn, isAuthor, controller.delete);

//RSVP /connections/rsvp
router.put('/:id/rsvp', isLoggedIn, validateId, controller.addRSVP);

router.put('/:id/cancelRsvp', validateId, controller.removeRSVP);


module.exports = router;