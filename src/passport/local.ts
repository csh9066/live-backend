import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { getRepository } from 'typeorm';
import User from '../entity/User';

export = () => {
  passport.use(
    new LocalStrategy(
      { usernameField: 'email', passwordField: 'password' },
      async (email, password, done) => {
        const userRepo = getRepository(User);
        try {
          const user = await userRepo.findOne({ email });
          if (!user || !(await user.checkPaaword(password))) {
            return done(null, false, { message: 'email or password wrong' });
          }
          return done(null, user);
        } catch (e) {
          done(e);
        }
      }
    )
  );
};
