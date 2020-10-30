import { serializeUser, deserializeUser } from 'passport';
import User from '../entity/User';
import facebook from './facebook';

export = () => {
  serializeUser((user: User, done) => {
    done(null, user);
  });

  deserializeUser(async (user: User, done) => {
    done(null, user);
  });
  facebook();
};
