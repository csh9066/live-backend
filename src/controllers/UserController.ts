import { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import User from '../entity/User';
import * as yup from 'yup';
import { getRepository } from 'typeorm';
import bcrypt from 'bcryptjs';

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const loginSchema = yup.object().shape({
    email: yup.string().required().email(),
    password: yup.string().required().min(8).max(16),
  });

  const validResult: boolean = await loginSchema.isValid(req.body);
  if (!validResult) {
    return res.status(400).send('유효하지 않은 형식입니다.');
  }

  passport.authenticate('local', (error, userId, info) => {
    if (error) {
      return next(error);
    }
    if (info) {
      return res.status(400).send('이메일주소 또는 비밀번호가 틀렸습니다.');
    }
    req.logIn(userId, async (loginError) => {
      if (loginError) {
        return next(loginError);
      }
      console.log(userId);

      const result = await getRepository(User).findOne({
        where: { id: userId },
        select: ['id', 'email', 'nickname', 'provider', 'createdAt'],
      });

      res.json(result);
    });
  })(req, res, next);
};

export const logout = (req: Request, res: Response) => {
  req.logOut();
  res.status(200).send('logout');
};

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const registerSchema = yup.object().shape({
    email: yup.string().required().email(),
    password: yup.string().required().min(8).max(16),
    nickname: yup.string().required(),
  });

  try {
    const validResult = await registerSchema.isValid(req.body);
    if (!validResult) {
      return res.status(400).send('유효하지 않은 형식입니다.');
    }

    const { email, password, nickname } = req.body;
    const userRepo = getRepository(User);

    const exitUser = await userRepo.findOne({ email });
    if (exitUser) {
      return res.status(400).send('이메일주소 또는 비밀번호가 틀렸습니다.');
    }

    const hashPassword = await bcrypt.hash(password, 10);
    await userRepo.save({
      email,
      password: hashPassword,
      nickname,
    });

    res.status(201).send('생성 완료');
  } catch (error) {
    next(error);
  }
};
