import { NextFunction, Request, Response } from 'express';
import { Server } from 'socket.io';
import { getRepository, In } from 'typeorm';
import Channel from '../entity/Channel';
import User from '../entity/User';
import { IUserSocketInfo, SocketEvent } from '../socket';

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
    const userMap: Map<number, IUserSocketInfo> = req.app.get('userMap');
    const membersToExcludeMe = members.filter(
      (member) => member.id !== authenticatedUser.id
    );

    membersToExcludeMe.forEach((member) => {
      if (userMap.has(member.id)) {
        io.to(String(userMap.get(member.id)?.socketId)).emit(
          SocketEvent.ADD_CHANNEL,
          channel
        );
      }
    });

    res.json(membersToExcludeMe);
  } catch (e) {
    next(e);
  }
};

export const removeChannelMember = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { channelId, memberId } = req.params;

  if (!channelId || !memberId) {
    return res.sendStatus(400);
  }

  const channelRepo = getRepository(Channel);
  const authenticatedUser = req.user as User;
  try {
    const channel = await channelRepo.findOne(channelId, {
      relations: ['members'],
    });

    // 채널이 없거나 권한이 없거나 요청하는 맴버 아이디와 세션 아이디가 다를 때
    if (
      !channel ||
      !channel.includeMemberBy(authenticatedUser.id) ||
      authenticatedUser.id !== parseInt(memberId)
    ) {
      return res.status(403).send('존재 하지않거나 권한이 없습니다.');
    }

    channel.members = channel.members.filter(
      (member) => member.id !== parseInt(memberId)
    );

    await channel.save();

    res.send('deleted at');
  } catch (e) {
    next(e);
  }
};
