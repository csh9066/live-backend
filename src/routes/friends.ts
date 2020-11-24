import express from 'express';
import {
  addFriendByEmail,
  createDirectMessage,
  listDirectMessages,
  listFriends,
} from '../controllers/FriendsController';
import { isLoggedIn } from '../middlewares';

const friendsRouter = express.Router();

friendsRouter.use(isLoggedIn);

friendsRouter.get('/', listFriends);
friendsRouter.post('/', addFriendByEmail);

friendsRouter.post('/:id/dm', createDirectMessage);
friendsRouter.get('/:id/dm', listDirectMessages);

export default friendsRouter;
