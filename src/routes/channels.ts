import {
  addChannelMembers,
  removeChannelMember,
} from './../controllers/ChannelController';
import express from 'express';
import { createChannel, listChannels } from '../controllers/ChannelController';
import { isLoggedIn } from '../middlewares';
import {
  createChannelChat,
  listChannelChats,
} from '../controllers/ChannelChatController';

const channelsRouter = express.Router();

channelsRouter.use(isLoggedIn);

channelsRouter.get('/', listChannels);
channelsRouter.post('/', createChannel);

channelsRouter.post('/:channelId/members', addChannelMembers);
channelsRouter.delete('/:channelId/members/:memberId', removeChannelMember);

channelsRouter.get('/:channelId/chats', listChannelChats);
channelsRouter.post('/:channelId/chats', createChannelChat);

export default channelsRouter;
