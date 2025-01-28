import express from 'express';
import UserController from '../controller/users-controller.js';

const router = express.Router();

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.post('/reset-password/:token', UserController.resetPassword);
router.post('/forget-password', UserController.forgetPassword);
router.get('/', UserController.getAllUsers);
router.get('/:id', UserController.getById);
router.put('/:id', UserController.updateUser);
router.delete('/:id', UserController.deleteUser);


export default router;