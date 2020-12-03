import { NextFunction, Request, Response } from 'express';
import { Server } from 'socket.io';
import { getRepository } from 'typeorm';
import DirectMessage from '../entity/DirectMessage';
import DirectMessageImage from '../entity/DirectMessageImage';
import User from '../entity/User';
import { IUserSocketInfo, SocketEvent } from '../socket';

export const createDirectMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = parseInt(req.params.id);

  const { chat, imageUrls }: { chat: string; imageUrls: string[] } = req.body;

  if (!chat || !id) {
    return res.sendStatus(400);
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
      content: chat,
      receiver,
      sender,
    });

    if (imageUrls && imageUrls.length !== 0) {
      await getRepository(DirectMessageImage).insert(
        imageUrls.map((imageUrl) => {
          return {
            src: imageUrl,
            message: createdDm,
          };
        })
      );
    }

    const serializedDm = await dmRepo.findOne({
      where: {
        id: createdDm.id,
      },
      relations: ['sender'],
    });

    const io: Server = req.app.get('io');
    const userMap: Map<number, IUserSocketInfo> = req.app.get('userMap');

    const userSocketInfo = userMap.get(id);
    if (userSocketInfo) {
      io.to(userSocketInfo.socketId).emit(SocketEvent.DM, serializedDm);
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

    if (!friend || !isFriend) {
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
