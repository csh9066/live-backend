import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import session from 'express-session';
import { createConnection } from 'typeorm';
import cors from 'cors';
import passport from 'passport';
import passportConfig from './passport';

import authRouter from './routes/auth';

dotenv.config();
const app = express();
app.set('port', process.env.PORT || 3005);
// console.log(ormconfig);

createConnection()
  .then(() => {
    console.log('데이터베이스 연결 성공');
  })
  .catch((e) => console.log(e));

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.COOKIE_SECRET!,
    cookie: {
      httpOnly: true,
      secure: false,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
passportConfig();

app.use('/auth', authRouter);

app.get('/test', (req, res) => {
  res.json(req.user);
});
app.use((error: any, req: Request, res: Response) => {
  console.log(error);
  res.status(500).json(error);
});

app.listen(app.get('port'), () => {
  console.log(`${app.get('port')} port에서 서버 실행 중`);
});
