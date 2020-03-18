const validator = require('./validatorBase');

const registrationConstraints = {

  firstName: {
    presence: {
      allowEmpty: false,
    },
  },

  lastName: {
    presence: {
      allowEmpty: false,
    },
  },

  email: {
    email: {
      message: 'Please provide a valid email'
    },
  },

  password: {
    presence: {
      allowEmpty: false,
    },
  },

  confirmPassword: {
    equality: {
      attribute: 'password',
      message: 'Passwords are not equal',
    },
    presence: {
      allowEmpty: false,
    },
  },

  referralCode: {
    presence: {
      allowEmpty: false,
    },
  },

  confirmCO: {
    presence: {
      allowEmpty: false,
      message: 'Please confirm this statement.'
    },
  }

};

module.exports = data => validator(data, registrationConstraints, { fullMessages: false });
