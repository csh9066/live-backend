import { NextFunction, Request, Response } from 'express';
import { Server } from 'socket.io';
import { getRepository } from 'typeorm';
import Channel from '../entity/Channel';
import ChannelChat from '../entity/ChannelChat';
import User from '../entity/User';
import { SocketEvent } from '../socket';

export const listChannelChats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { channelId } = req.params;

  if (!channelId) {
    return res.sendStatus(400);
  }

  const userRepo = getRepository(User);
  try {
    const authenticatedUser = req.user as User;

    const serializedUser = (await userRepo.findOne(authenticatedUser.id, {
      relations: ['channels', 'channels.chats', 'channels.chats.sender'],
    })) as User;

    const channel = serializedUser.channels.find(
      (channel) => channel.id === parseInt(channelId)
    );

    if (!channel) {
      res.status(403).send('존재 하지않거나 권한이 없습니다.');
    }

    res.json(channel?.chats);
  } catch (e) {
    next(e);
  }
};

export const createChannelChat = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { channelId } = req.params;
  const { content } = req.body;

  if (!channelId || !content) {
    return res.sendStatus(400);
  }
  const userRepo = getRepository(User);
  const chatRepop = getRepository(ChannelChat);

  try {
    const authenticatedUser = req.user as User;

    const serializedUser = (await userRepo.findOne(
      authenticatedUser.id
    )) as User;

    const channel = await getRepository(Channel).findOne(channelId, {
      relations: ['members', 'chats'],
    });

    if (!channel || !channel?.includeMemberBy(serializedUser.id)) {
      return res.status(403).send('존재 하지않거나 권한이 없습니다.');
    }
    const newChat = await chatRepop.create({
      sender: serializedUser,
      content,
      channel,
    });
    await newChat.save();

    const returnedChat = await chatRepop.findOne(newChat.id, {
      relations: ['sender'],
    });

    const io: Server = req.app.get('io');
    io.to(channelId).emit(SocketEvent.CHANNEL_CHAT, {
      message: returnedChat,
      channelId,
    });

    res.sendStatus(201);
  } catch (e) {
    next(e);
  }
};
