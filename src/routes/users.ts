import express from 'express';
import { addFriendByEmail, getFriends } from '../controllers/UsersController';
import { isLoggedIn } from '../middlewares';

const usersRouter = express.Router();

usersRouter.use(isLoggedIn);

usersRouter.get('/friends', getFriends);
usersRouter.get('/friends/:email');
usersRouter.post('/friends/:email', addFriendByEmail);

export default usersRouter;
