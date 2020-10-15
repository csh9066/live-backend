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
    return res.status(400).send('Bad request');
  }

  passport.authenticate('local', (error, user: User, info) => {
    if (error) {
      return next(error);
    }
    if (info) {
      return res.status(401).send(info.message);
    }
    req.logIn(user, async (loginError) => {
      if (loginError) {
        return next(loginError);
      }
      res.json(user);
    });
  })(req, res, next);
};

export const logout = (req: Request, res: Response) => {
  req.logOut();
  res.status(200).send('logout');
};

export const join = async (req: Request, res: Response, next: NextFunction) => {
  const registerSchema = yup.object().shape({
    email: yup.string().required().email(),
    password: yup.string().required().min(8).max(16),
    nickname: yup.string().required(),
  });
  try {
    const validResult = await registerSchema.isValid(req.body);
    if (!validResult) {
      return res.status(400).send('Bad request');
    }
    const { email, password, nickname } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    const userRepo = getRepository(User);
    await userRepo.save({
      email,
      password: hashPassword,
      nickname,
    });

    res.status(201).send('created at');
  } catch (error) {
    next(error);
  }
};
