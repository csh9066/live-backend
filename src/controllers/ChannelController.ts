import { NextFunction, Request, Response } from 'express';
import { getRepository } from 'typeorm';
import Channel from '../entity/Channel';
import ChannelChat from '../entity/ChannelChat';
import User from '../entity/User';

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
      relations: ['channels'],
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
    const createdChannel = await channelRepo.create({
      title,
    });

    const authenticatedUser = req.user as User;

    const serializedUser = (await userRepo.findOne(
      authenticatedUser.id
    )) as User;

    createdChannel.users = [serializedUser];
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
  const { id } = req.params;

  if (!id) {
    return res.sendStatus(400);
  }

  const channelRepo = getRepository(Channel);
  const userRepo = getRepository(User);
  try {
    const authenticatedUser = req.user as User;

    const serializedUser = (await userRepo.findOne(authenticatedUser.id, {
      relations: ['channels', 'channels.chats'],
    })) as User;

    const channel = serializedUser.channels.find(
      (channel) => channel.id === parseInt(id)
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
  const { id } = req.params;
  const { content } = req.body;

  if (!id || !content) {
    return res.sendStatus(400);
  }
  const userRepo = getRepository(User);
  const chatRepop = getRepository(ChannelChat);

  try {
    const authenticatedUser = req.user as User;

    const serializedUser = (await userRepo.findOne(
      authenticatedUser.id
    )) as User;

    const channel = await getRepository(Channel)
      .createQueryBuilder('channel')
      .leftJoinAndSelect('channel.users', 'user')
      .leftJoinAndSelect('channel.chats', 'chat')
      .where('user.id = :userId', { userId: serializedUser.id })
      .andWhere('channel.id = :channelId', { channelId: id })
      .getOne();

    if (!channel) {
      return res.status(403).send('존재 하지않거나 권한이 없습니다.');
    }

    const createdChat = await chatRepop.create({
      author: serializedUser,
      content,
    });

    channel.chats.push(createdChat);
    await channel.save();

    res.json(createdChat);
  } catch (e) {
    next(e);
  }
};
