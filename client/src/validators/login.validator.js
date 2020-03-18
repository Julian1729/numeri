const validator = require('./validatorBase');

const loginRestraints = {

  email: {
    presence: {
      message: 'Please enter your email',
    },
    email: {
      message: 'Please enter a valid email',
    },
  },

  password: {
    presence: {
      message: 'Please enter your password',
    },
  }

};

module.exports = data => validator(data, loginRestraints, { fullMessages: false });
