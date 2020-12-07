import passport from 'passport';
import { Strategy as FaceBookStrategy } from 'passport-facebook';
import { getRepository } from 'typeorm';
import User from '../entity/User';

export = () => {
  passport.use(
    new FaceBookStrategy(
      {
        clientID: process.env.FACEBOOK_CLIENT_ID as string,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
        callbackURL: `${process.env.API_URL}/auth/facebook/callback`,
        profileFields: ['id', 'email', 'name', 'photos', 'displayName'],
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
            return done(null, user);
          }

          const createdUser = await userRepo.save({
            profileImageUrl: profileImageUrl?.value,
            email: profile._json && profile._json.email,
            provider: 'facebook',
            nickname: profile.displayName,
          });

          return done(null, createdUser);
        } catch (e) {
          console.error(e);
          done(e);
        }
      }
    )
  );
};
