import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import session from 'express-session';
import { createConnection } from 'typeorm';
import cors from 'cors';
import passport from 'passport';

dotenv.config();

import passportConfig from './passport';

import authRouter from './routes/auth';
import friendsRouter from './routes/friends';
import socket from './socket';
import channelsRouter from './routes/channels';
import imageRouter from './routes/image';

const app = express();
app.set('port', process.env.PORT || 3005);

createConnection()
  .then(() => {
    console.log('데이터베이스 연결 성공');
  })
  .catch((e) => console.log(e));

app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(
  cors({
    origin:
      process.env.NODE_ENV === 'production' ? process.env.CLIENT_URL : true,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.COOKIE_SECRET!,
    proxy: true,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
passportConfig();

app.use('/auth', authRouter);
app.use('/friends', friendsRouter);
app.use('/channels', channelsRouter);
app.use('/image', imageRouter);

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  console.log(error);
  res.status(500).json(error);
});

const server = app.listen(app.get('port'), () => {
  console.log(`${app.get('port')} port에서 서버 실행 중`);
});

socket(server, app);
