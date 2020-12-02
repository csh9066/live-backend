import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { getRepository } from 'typeorm';
import User from '../entity/User';

// 테스트용
export = () => {
  passport.use(
    new LocalStrategy(
      { usernameField: 'email', passwordField: 'password' },
      async (email, password, done) => {
        const userRepo = getRepository(User);
        try {
          const user = await userRepo.findOne({
            email,
            password,
            provider: 'local',
          });

          if (!user) {
            return done(null, null, { message: 'not found' });
          }

          return done(null, user);
        } catch (e) {
          done(e);
        }
      }
    )
  );
};
