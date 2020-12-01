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
    successRedirect: 'http://localhost:3000/app',
  })
);

export default authRouter;
