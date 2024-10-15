const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const userModel = require('../models/user.model');
const { createToken } = require('./authUtils');

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/api/v1/auth/google/callback',
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Check if user exists
                let user = await userModel.findOne({ googleId: profile.id });

                if (!user) {
                    // If not, create a new user
                    user = await userModel.create({
                        usr_name: profile.displayName,
                        usr_email: profile.emails[0].value,
                        googleId: profile.id,
                    });
                }

                // Create JWT
                const token = createToken({ userId: user._id, email: user.usr_email });

                done(null, { token });
            } catch (error) {
                done(error, null);
            }
        }
    )
);
