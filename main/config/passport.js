const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(new GoogleStrategy(
    // 구글 API사이트에서 내 어플리케션을 추가함
    {
      clientID : "536713290074-s61vghub2gv5a55kqsq07jjdgl8nr0pt.apps.googleusercontent.com",
      clientSecret : "yfCXVebf7zbSTOnlnHldCJ0y",
      callbackURL : 'https://www.devel-airbnb.shop/oauth',
      // scope: 'https://www.googleapis.com/auth/calendar',
      // passReqToCallback : true
    },
    function(accessToken, refreshToken, profile, done){
      process.nextTick(function() {
        user = profile;
        console.log(user.id);
        return done(null, user);
      });

      }
    )
);

module.exports = passport;