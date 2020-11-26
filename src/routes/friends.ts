import { removeFriend } from '../controllers/FriendController';
import express from 'express';
import { addFriendByEmail, listFriends } from '../controllers/FriendController';
import { isLoggedIn } from '../middlewares';
import {
  createDirectMessage,
  listDirectMessages,
} from '../controllers/DirectMessageController';

const friendsRouter = express.Router();

friendsRouter.use(isLoggedIn);

friendsRouter.get('/', listFriends);
friendsRouter.post('/', addFriendByEmail);
friendsRouter.delete('/:id', removeFriend);

friendsRouter.post('/:id/dm', createDirectMessage);
friendsRouter.get('/:id/dm', listDirectMessages);

export default friendsRouter;
