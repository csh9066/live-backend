import { NextFunction, Request, Response } from 'express';
import { Server } from 'socket.io';
import { getRepository } from 'typeorm';
import User from '../entity/User';
import { removeFriendInSocketInfo } from '../lib/socketHelpers';
import { IUserSocketInfo, SocketEvent } from '../socket';

export const listFriends = async (req: Request, res: Response) => {
  const userRepo = getRepository(User);
  const authenticatedUser = req.user as User;

  const me = await userRepo.findOne({
    where: {
      id: authenticatedUser.id,
    },
    relations: ['friends'],
  });
  return res.json(me?.friends);
};

export const addFriendByEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send('이메일을 입력 해주세요');
  }

  try {
    const authenticatedUser = req.user as User;
    const userRepo = getRepository(User);

    const friendToBeAdded = await userRepo.findOne({
      where: { email },
      relations: ['friends'],
    });

    if (!friendToBeAdded) {
      return res.status(404).send('존재하지 않는 유저입니다');
    }

    if (friendToBeAdded.email === authenticatedUser.email) {
      return res.status(400).send('자기 자신을 추가할 수 없습니다.');
    }

    const me = (await userRepo.findOne({
      where: {
        id: authenticatedUser.id,
      },
      relations: ['friends'],
    })) as User;

    const isAddedFriend = me?.friends?.find(
      (user) => user.id === friendToBeAdded.id
    );

    if (isAddedFriend) {
      return res.status(409).send('이미 친구 등록된 상태입니다.');
    }

    me?.friends.push(friendToBeAdded);
    friendToBeAdded.friends.push(me);
    await friendToBeAdded.save();
    await me.save();

    const serializeAddedFriend = (await userRepo.findOne(
      friendToBeAdded.id
    )) as User;

    const io: Server = req.app.get('io');
    const userMap: Map<number, IUserSocketInfo> = req.app.get('userMap');
    const userSocketInfo = userMap.get(me.id);
    const addedUserSocketInfo = userMap.get(serializeAddedFriend.id);

    if (userSocketInfo) {
      userSocketInfo.friendIds.push(serializeAddedFriend.id);
    }

    if (addedUserSocketInfo) {
      addedUserSocketInfo.friendIds.push(me.id);
      io.to(addedUserSocketInfo.socketId).emit(
        SocketEvent.ADD_FRIEND,
        authenticatedUser
      );
    }

    res.json(serializeAddedFriend);
  } catch (e) {
    next(e);
  }
};

export const removeFriend = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = parseInt(req.params.id);

  if (!id) {
    res.sendStatus(400);
  }

  const authenticatedUser = req.user as User;
  const userRepo = getRepository(User);

  try {
    const removeFriend = await userRepo.findOne(id, {
      relations: ['friends'],
    });

    const isFriend = removeFriend?.friends.some(
      (friend) => friend.id === authenticatedUser.id
    );

    if (!removeFriend || !isFriend) {
      return res.status(403).send('존재하지 않는 유저거나 권한이 없습니다');
    }

    const me = (await userRepo.findOne(authenticatedUser.id, {
      relations: ['friends'],
    })) as User;

    me.friends = me.friends.filter((friend) => friend.id !== removeFriend.id);
    removeFriend.friends = removeFriend.friends.filter(
      (friend) => friend.id !== me.id
    );
    await me.save();
    await removeFriend.save();

    const io: Server = req.app.get('io');
    const userMap: Map<number, IUserSocketInfo> = req.app.get('userMap');
    const userSocketInfo = userMap.get(me.id);
    const removeduseSocketInfo = userMap.get(removeFriend.id);

    if (userSocketInfo) {
      removeFriendInSocketInfo(userSocketInfo, removeFriend.id);
    }

    if (removeduseSocketInfo) {
      removeFriendInSocketInfo(removeduseSocketInfo, me.id);
      io.to(removeduseSocketInfo.socketId).emit(
        SocketEvent.REMOVE_FRIEND,
        me.id
      );
    }

    res.send('deleted at');
  } catch (e) {
    next(e);
  }
};
