import express from 'express';
import { addFriendByEmail, getFriends } from '../controllers/FriendsController';
import { isLoggedIn } from '../middlewares';

const usersRouter = express.Router();

usersRouter.use(isLoggedIn);

usersRouter.get('/', getFriends);
usersRouter.get('/:email');
usersRouter.post('/:email', addFriendByEmail);

usersRouter.post('/:id/dm');
usersRouter.get('/:id/dm');

export default usersRouter;
