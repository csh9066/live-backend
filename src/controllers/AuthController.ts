import { Request, Response } from 'express';

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
