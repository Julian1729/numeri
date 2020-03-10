const validator = require('./validatorBase');

const registrationConstraints = {

  firstName: {
    presence: true,
  },

  lastName: {
    presence: true,
  },

  email: {
    presence: true,
    email: true,
  },

  password: {
    presence: true,
  },

  confirmPassword: {
    equality: {
      attribute: 'password',
      message: 'Passwords are not equal',
    }
  },

  referralCode: {
    presence: true,
  },

};

module.exports = (data) => validator(data, registrationConstraints, { fullMessages: false });
