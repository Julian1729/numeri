const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/User.model');

module.exports = passport => {
  passport.serializeUser((user, done) => {
    return done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id)
      .populate('circuitId')
      .then(user => {
        console.log(JSON.stringify(user, null, 2));
        return done(null, user);
      })
      .catch(err => done(err));
  });

  // Config Local Strategy
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      User.findOne({ email })
        .populate('circuitId')
        .then(user => {
          if (!user) {
            return done(null, false);
          }

          bcrypt
            .compare(password, user.password)
            .then(validPassword => {
              if (!validPassword) {
                return done(null, false, { message: 'Incorrect password' });
              }

              // return user
              return done(null, user);
            })
            .catch(e => done(e));
        })
        .catch(e => done(e));
    })
  );
};
