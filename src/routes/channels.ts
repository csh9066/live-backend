import { addChannelMembers } from './../controllers/ChannelController';
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

channelsRouter.post('/:channelId/members', addChannelMembers);

channelsRouter.get('/:channelId/chats', listChannelChats);
channelsRouter.post('/:channelId/chats', createChannelChat);

export default channelsRouter;
