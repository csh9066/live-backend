import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { getRepository } from 'typeorm';
import User from '../entity/User';

export = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        callbackURL: `${process.env.API_URL}/auth/google/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        const profileImageUrl = profile.photos?.shift();
        const userRepo = getRepository(User);
        try {
          const user = await userRepo.findOne({
            email: profile._json && profile._json.email,
            provider: profile.provider,
          });

          if (user) {
            return done(undefined, user);
          }

          const createdUser = await userRepo.save({
            profileImageUrl: profileImageUrl?.value,
            email: profile._json && profile._json.email,
            provider: profile.provider,
            nickname: profile.displayName,
          });

          return done(undefined, createdUser);
        } catch (e) {
          console.error(e);
          done(e);
        }
      }
    )
  );
};
