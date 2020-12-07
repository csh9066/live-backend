import express from 'express';
import passport from 'passport';
import * as AuthController from '../controllers/AuthController';

const authRouter = express.Router();

authRouter.get('/check', AuthController.check);
authRouter.get('/logout', AuthController.logout);
authRouter.post('/local/login', AuthController.localLogin);

authRouter.get(
  '/facebook',
  passport.authenticate('facebook', { scope: 'email' })
);

authRouter.get(
  '/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: `${process.env.CLIENT_URL}/app`,
  })
);

authRouter.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);
authRouter.get(
  '/google/callback',
  passport.authenticate('google', {
    successRedirect: `${process.env.CLIENT_URL}/app`,
  })
);

export default authRouter;
