const LocalStrategy = require('passport-local').Strategy
const User = require('../model/User')

module.exports = (passport) =>{
    passport.use(new LocalStrategy(
        function(email, password, done) {
          User.findOne({ email: email }, function (err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            if (!user.verifyPassword(password)) { return done(null, false); }
            return done(null, user);
          });
        }
      ));
}