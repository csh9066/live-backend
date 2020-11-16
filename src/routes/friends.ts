import express from 'express';
import {
  addFriendByEmail,
  createDirectMessage,
  getFriends,
  listDirectMessage,
} from '../controllers/FriendsController';
import { isLoggedIn } from '../middlewares';

const usersRouter = express.Router();

usersRouter.use(isLoggedIn);

usersRouter.get('/', getFriends);
usersRouter.get('/:email');
usersRouter.post('/:email', addFriendByEmail);

usersRouter.post('/:id/dm', createDirectMessage);
usersRouter.get('/:id/dm', listDirectMessage);

export default usersRouter;
