import { NextFunction, Request, Response } from 'express';
import { getRepository } from 'typeorm';
import User from '../entity/User';

export const getFriends = async (req: Request, res: Response) => {
  const userRepo = getRepository(User);
  const serializedUser = req.user as User;

  const me = await userRepo.findOne({
    where: {
      id: serializedUser.id,
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
  const { email } = req.params;
  if (!email) {
    return res.status(404).send('존재 하지 않는 유저입니다.');
  }
  try {
    const serializedUser = req.user as User;
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
        id: serializedUser.id,
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

    const AddedFrined = await userRepo.findOne({
      where: { email },
    });

    res.json(AddedFrined);
  } catch (e) {
    next(e);
  }
};
