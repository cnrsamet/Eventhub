const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');


const router = express.Router();

//localholst/user
router.route('/').get(userController.getAllUsers);
router.route('/login').post(userController.loginUser);
router.route('/create').post(userController.userCreate);
router.route('/:id').delete(authMiddleware, userController.deleteUser);
router.route('/:id').put(authMiddleware, userController.updateUser);
router.route('/logout').get(userController.logoutUser);


module.exports = router;
