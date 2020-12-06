import { serializeUser, deserializeUser } from 'passport';
import User from '../entity/User';
import facebook from './facebook';
import google from './google';
import local from './local';

export = () => {
  serializeUser((user: User, done) => {
    done(null, user);
  });

  deserializeUser(async (user: User, done) => {
    done(null, user);
  });
  facebook();
  local();
  google();
};
