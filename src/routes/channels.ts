import express from 'express';
import {
  createChannel,
  createChannelChat,
  listChannelChats,
  listChannels,
} from '../controllers/ChannelController';
import { isLoggedIn } from '../middlewares';

const channelsRouter = express.Router();

channelsRouter.use(isLoggedIn);

channelsRouter.get('/', listChannels);
channelsRouter.post('/', createChannel);

channelsRouter.get('/:id/chats', listChannelChats);
channelsRouter.post('/:id/chats', createChannelChat);

export default channelsRouter;
