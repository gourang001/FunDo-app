/* eslint-disable prettier/prettier */
import express from 'express';
import * as userController from '../controllers/user.controller';
import { newUserValidator } from '../validators/user.validator';
// import { userAuth } from '../middlewares/auth.middleware';

const router = express.Router();
router.post('/', newUserValidator, userController.newUser);
router.post('/login', userController.loginUser);

export default router;
