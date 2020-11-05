import { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import User from '../entity/User';

export const logout = (req: Request, res: Response) => {
  req.logOut();
  res.sendStatus(204);
};

// 세션 체크
export const check = (req: Request, res: Response) => {
  if (!req.user) {
    return res.sendStatus(401);
  }
  return res.json(req.user);
};

export const localLogin = (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;

  if (!email) {
    return res.sendStatus(404);
  }

  passport.authenticate('local', (error, user: User) => {
    if (error) {
      return next(error);
    }

    req.logIn(user, (loginError) => {
      if (loginError) {
        return next(loginError);
      }
      res.json(user);
    });
  })(req, res, next);
};
