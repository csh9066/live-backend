import { NextFunction, Request, Response } from 'express';
import { Server, Socket } from 'socket.io';
import { getRepository, In } from 'typeorm';
import Channel from '../entity/Channel';
import ChannelChat from '../entity/ChannelChat';
import User from '../entity/User';
import { IOnlineMap, SocketEvent } from '../socket';

export const listChannels = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userRepo = getRepository(User);
  try {
    const authenticatedUser = req.user as User;
    const serializedUser = await userRepo.findOne({
      where: {
        id: authenticatedUser.id,
      },
      relations: ['channels', 'channels.members'],
    });

    res.json(serializedUser?.channels);
  } catch (e) {
    next(e);
  }
};

export const createChannel = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title } = req.body;

  if (!title) {
    return res.sendStatus(400);
  }

  const channelRepo = getRepository(Channel);
  const userRepo = getRepository(User);

  try {
    const authenticatedUser = req.user as User;

    const serializedUser = (await userRepo.findOne(
      authenticatedUser.id
    )) as User;

    const createdChannel = await channelRepo.create({
      title,
      members: [serializedUser],
    });
    await createdChannel.save();

    res.json(createdChannel);
  } catch (e) {
    next(e);
  }
};

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

export const addChannelMembers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const emails: string[] = req.body.emails;
  const { channelId } = req.params;

  if (!emails || emails.length === 0 || !channelId) {
    return res.sendStatus(400);
  }

  const channelRepo = getRepository(Channel);
  const userRepo = getRepository(User);
  const authenticatedUser = req.user as User;

  try {
    const channel = await channelRepo.findOne(channelId, {
      relations: ['members'],
    });

    if (!channel || !channel.includeMemberBy(authenticatedUser.id)) {
      return res.status(403).send('존재 하지않거나 권한이 없습니다.');
    }

    const members = await userRepo.find({
      where: {
        email: In([...emails]),
      },
    });

    channel.members.push(...members);
    await channel.save();

    const io: Server = req.app.get('io');
    const onlineMap: IOnlineMap = req.app.get('onlineMap');

    members.forEach((member) => {
      if (onlineMap[member.id]) {
        io.to(onlineMap[member.id]).emit(SocketEvent.ADD_CHANNEL, channel);
      }
    });

    res.json(members);
  } catch (e) {
    next(e);
  }
};
