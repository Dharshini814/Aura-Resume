const passport = require("passport");

const GoogleStrategy =
  require("passport-google-oauth20").Strategy;

/*const FacebookStrategy =
  require("passport-facebook").Strategy;*/

const User = require("../models/User");

/* SESSION */
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);

  done(null, user);
});

/* GOOGLE */
passport.use(
  new GoogleStrategy(
    {
      clientID:
        process.env.GOOGLE_CLIENT_ID,

      clientSecret:
        process.env.GOOGLE_CLIENT_SECRET,

     callbackURL: "https://aura-resume-dujg.onrender.com/api/auth/google/callback",
    },

    async (
      accessToken,
      refreshToken,
      profile,
      done
    ) => {
      try {
        let user = await User.findOne({
          googleId: profile.id,
        });

        if (!user) {
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
          });
        }

        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

/* FACEBOOK 
passport.use(
  new FacebookStrategy(
    {
      clientID:
        process.env.FACEBOOK_APP_ID,

      clientSecret:
        process.env.FACEBOOK_APP_SECRET,

      callbackURL: "http://localhost:5000/api/auth/facebook/callback",

      profileFields: [
        "id",
        "emails",
        "name",
      ],
    },

    async (
      accessToken,
      refreshToken,
      profile,
      done
    ) => {
      try {
        let user = await User.findOne({
          facebookId: profile.id,
        });

        if (!user) {
          user = await User.create({
            facebookId: profile.id,

            name:
              profile.name.givenName +
              " " +
              profile.name.familyName,

            email:
              profile.emails?.[0]?.value ||
              `${profile.id}@facebook.com`,
          });
        }

        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);*/
