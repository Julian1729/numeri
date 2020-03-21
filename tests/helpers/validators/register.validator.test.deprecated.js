const { expect } = require('chai');

const registrationValidator = require('../../../helpers/validators/registration.validator');

describe('Register Validator', () => {

  it('should pass validation', () => {

      const sampleData = {
        firstName: 'James',
        lastName: 'Jackson',
        email: 'jack@gmail.com',
        password: 'thisisMyPass',
        confirmPassword: 'thisisMyPass',
        referralCode: '13rfg',
      };

      const result = registrationValidator(sampleData);

      expect(result).to.be.undefined;

  });

  it('should fail with mismatched password', () => {

    const sampleData = {
      firstName: 'James',
      lastName: 'Jackson',
      email: 'jack@gmail.com',
      password: 'thisisMyPass',
      confirmPassword: 'thisisMyPass123',
      referralCode: '13rfg',
    };

    const result = registrationValidator(sampleData);

    expect(result).to.not.be.undefined;
    expect(result).to.have.property('confirmPassword');

  });

});
