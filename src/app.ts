import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import session from 'express-session';
import { createConnection } from 'typeorm';

dotenv.config();
const app = express();
app.set('port', process.env.PORT || 3005);
// console.log(ormconfig);

createConnection()
  .then(() => {
    console.log('데이터베이스 연결 성공');
  })
  .catch((e) => console.log(e));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET!,
    cookie: {
      httpOnly: true,
      secure: false,
    },
  })
);

app.listen(app.get('port'), () => {
  console.log(`${app.get('port')} port에서 서버 실행 중`);
});
