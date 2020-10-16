import { serializeUser, deserializeUser } from 'passport';
import User from '../entity/User';
import local from './local';

export = () => {
  serializeUser((userId: User, done) => {
    done(null, userId);
  });
  deserializeUser(async (id: string, done) => {
    try {
      const user = await User.findOneOrFail(id);
      done(null, user);
    } catch (error) {
      console.log(error);
      done(error);
    }
  });
  local();
};
