import { serializeUser, deserializeUser } from 'passport';
import User from '../entity/User';
import local from './local';

export = () => {
  serializeUser((userId: User, done) => {
    done(null, userId);
  });
  deserializeUser(async (id: string, done) => {
    try {
      const user = await User.findOneOrFail({
        where: { id },
        select: ['id', 'email', 'nickname', 'provider', 'createdAt'],
      });
      done(null, user);
    } catch (error) {
      console.log(error, 'ssibal');
      done(error);
    }
  });
  local();
};
