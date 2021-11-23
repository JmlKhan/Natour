const express = require('express');
const userRouter = require('../controller/userController');
const authController = require('../controller/authController');
const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.post('/resetPassword', authController.login);

router.route('/').get(userRouter.getAllUsers).post(userRouter.createUser);
router
  .route('/:id')
  .get(userRouter.getUser)
  .patch(userRouter.updateUser)
  .delete(userRouter.deleteUser);

module.exports = router;
