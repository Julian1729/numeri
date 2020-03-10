const { expect } = require('chai');

const { accountHelpers } = require('../../helpers');

describe('Account Helpers', () => {

  describe('validatePassword', () => {

    it('passes secure password', () => {

      const password = '@GoodPass123';
      expect(accountHelpers.validatePassword(password)).have.lengthOf(0);

    });

    it('fails password when too short', () => {

      const password = '@G123';
      const errors = accountHelpers.validatePassword(password)
      expect(errors).have.lengthOf(1);
      expect(errors[0]).to.equal('must be longer than 7 characters');

    });

    it('fails password with no capital letter', () => {

      const password = '@badpass123';
      const errors = accountHelpers.validatePassword(password)
      expect(errors).have.lengthOf(1);
      expect(errors[0]).to.equal('must contain at least 1 capital letter');

    });

    it('fails password with no special char', () => {

      const password = 'Badpass123';
      const errors = accountHelpers.validatePassword(password)
      expect(errors).have.lengthOf(1);
      expect(errors[0]).to.equal('must contain at least 1 special character');

    });

    it('fails password with no number', () => {

      const password = 'Badpass@#$';
      const errors = accountHelpers.validatePassword(password)
      expect(errors).have.lengthOf(1);
      expect(errors[0]).to.equal('must contain at least 1 number');

    });

    it('fails password with all requirements', () => {

      const password = 'bad';
      const errors = accountHelpers.validatePassword(password)
      expect(errors).have.lengthOf(4);

    });

  });

  describe('hashPassword', () => {

    it('hashes password and returns promise w/ promise', (done) => {

      accountHelpers.hashPassword('rawPasswordhere')
        .then(hash => {
          expect(typeof hash).to.equal('string');
          done();
        })
        .catch(e => done(e));

    });

  });

});
