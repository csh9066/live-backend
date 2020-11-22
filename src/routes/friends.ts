import express from 'express';
import {
  addFriendByEmail,
  createDirectMessage,
  listDirectMessages,
  listFriends,
} from '../controllers/FriendsController';
import { isLoggedIn } from '../middlewares';

const usersRouter = express.Router();

usersRouter.use(isLoggedIn);

usersRouter.get('/', listFriends);
usersRouter.get('/:email');
usersRouter.post('/:email', addFriendByEmail);

usersRouter.post('/:id/dm', createDirectMessage);
usersRouter.get('/:id/dm', listDirectMessages);

export default usersRouter;
