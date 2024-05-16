const express = require('express');
const eventController = require('../controllers/eventController');
const rsvpController = require('../controllers/rsvpController');
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middlewares/authMiddleware');


const router = express.Router();

//localholst/events
router.route('/').get(eventController.getAllEvents);
router.route('/').post(authMiddleware, eventController.createEvent);
router.route('/:eventId').get(eventController.getEventById);
router.route('/:eventId').put(authMiddleware, eventController.updateEvent);
router.route('/:eventId').delete(authMiddleware, eventController.deleteEvent);



//Event RSVP İşlemleri
router.route('/:eventId/rsvp').post(authMiddleware, rsvpController.createRSVP);
router.route('/:eventId/rsvps').get(rsvpController.getEventRSVPs);
router.route('/:eventId/rsvp/:rsvpId').put(authMiddleware, rsvpController.updateRSVP);
router.route('/:eventId/rsvp/:rsvpId').delete(authMiddleware, rsvpController.deleteRSVP);

//comments
router.route('/:eventId/comments').post(authMiddleware, commentController.createComment);
router.route('/:eventId/comments').get(commentController.getEventComments);
router.route('/:eventId/comments/:commentId').get(authMiddleware, commentController.updateComment);
router.route('/:eventId/comments/:commentId').get(authMiddleware, commentController.deleteComment);


module.exports = router;