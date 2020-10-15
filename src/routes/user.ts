import express from 'express';
import * as UserController from '../controllers/UserController';

const router = express.Router();

router.post('/', UserController.join);
router.post('/login', UserController.login);
router.get('/logout', UserController.logout);

export default router;
