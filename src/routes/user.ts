import express from 'express';
import * as UserController from '../controllers/UserController';

const router = express.Router();

router.post('/login', UserController.login);
router.get('/logout', UserController.logout);
router.post('/', UserController.createUser);
router.get('/check', UserController.check);

export default router;
