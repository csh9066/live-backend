import { NextFunction, Request, Response } from 'express';
import { send } from 'process';
import { Server } from 'socket.io';
import { getRepository } from 'typeorm';
import DirectMessage from '../entity/DirectMessage';
import User from '../entity/User';
import { IOnlineMap, SocketEvent } from '../socket';

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
    return res.status(404).send('존재 하지 않는 유저입니다.');
  }
  try {
    const authenticatedUser = req.user as User;
    const userRepo = getRepository(User);

    const friendToBeAdded = await userRepo.findOne({
      where: { email },
      relations: ['friends'],
    });

    if (!friendToBeAdded) {
      return res.status(404).send('존재하지 않은 유저 입니다.');
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

    const addedFrined = await userRepo.findOne({
      where: { email },
    });

    const io: Server = req.app.get('io');
    const onlineMap: IOnlineMap = req.app.get('onlineMap');

    if (addedFrined && onlineMap[addedFrined.id]) {
      io.to(onlineMap[addedFrined.id]).emit(
        SocketEvent.ADD_FRIEND,
        authenticatedUser
      );
    }

    res.json(addedFrined);
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
    const onlineMap: IOnlineMap = req.app.get('onlineMap');

    if (onlineMap[removeFriend.id]) {
      io.to(onlineMap[removeFriend.id]).emit(SocketEvent.REMOVE_FRIEND, me.id);
    }

    res.send('deleted at');
  } catch (e) {
    next(e);
  }
};

export const createDirectMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = parseInt(req.params.id);
  const { content } = req.body;

  if (!content || !id) {
    res.sendStatus(400);
  }

  const authenticatedUser = req.user as User;
  const userRepo = getRepository(User);
  const dmRepo = getRepository(DirectMessage);

  try {
    const receiver = await userRepo.findOne(id);
    const sender = await userRepo.findOne(authenticatedUser.id);

    if (!receiver || !sender) {
      res.status(404).send('존재 하지 않는 유저입니다');
    }

    const createdDm = await dmRepo.save({
      content,
      receiver,
      sender,
    });

    const serializedDm = await dmRepo.findOne({
      where: {
        id: createdDm.id,
      },
      relations: ['sender'],
    });

    const io: Server = req.app.get('io');
    const onlineMap: IOnlineMap = req.app.get('onlineMap');

    if (onlineMap[id]) {
      io.to(onlineMap[id]).emit(SocketEvent.DM, {
        message: serializedDm,
        senderId: serializedDm?.sender.id,
      });
    }

    res.json(serializedDm);
  } catch (e) {
    next(e);
  }
};

export const listDirectMessages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const authenticatedUser = req.user as User;
  try {
    const friend = await getRepository(User).findOne(id, {
      relations: ['friends'],
    });

    const isFriend = friend?.friends.some(
      (friend) => friend.id === authenticatedUser.id
    );

    if (!removeFriend || !isFriend) {
      return res.status(403).send('존재하지 않는 유저거나 권한이 없습니다');
    }

    const dmList = await getRepository(DirectMessage).find({
      where: [
        { sender: { id }, receiver: { id: authenticatedUser.id } },
        { sender: { id: authenticatedUser.id }, receiver: { id } },
      ],
      relations: ['sender'],
    });

    res.json(dmList);
  } catch (e) {
    next(e);
  }
};
