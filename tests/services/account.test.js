const chai = require('chai');
const asserttype = require('chai-asserttype');
chai.use(asserttype);
const expect = chai.expect;

const errors = require('../../Errors');
const User = require('../../models/User.model');
const users = require('../fixtures/users.fixture');
const database = require('../../models/database');
const { accountServices } = require('../../services');

describe('Account Services', () => {

  before(async () => {
    // use test database
    process.env.MONGODB_URI = 'mongodb://localhost:27017/NumeriTest';
    await database();
  });

  after(() => {
    delete process.env.MONGODB_URI;
  });

  beforeEach(async () => {
    // clear user database
    await User.deleteMany({});
  });

  describe('registerUser', () => {

    let seedUser = null;
    beforeEach(async () => {
      // seed existing user into db to satisfy refCode search
      seedUser = await User.create(users[0]);
    });

    it('registers and returns valid user', done => {

      const testPass = 'JamesIsc00l123@';
      const testUser = {
        firstName: 'James',
        lastName: 'Jackson',
        email: 'james123@example.com',
        password: testPass,
      };

      accountServices.registerUser(testUser, seedUser.refCode)
        .then(user => {
          expect(user).to.exist;
          expect(user).to.have.property('id');
          expect(user).to.have.property('refCode');
          expect(user.refCode).to.be.string();
          // should not have raw password
          expect(user.password).to.not.equal(testPass);
          done();
        })
        .catch(e => done(e));

    });

    it('throws InsecurePassword error when password does not meet requirements', done => {

      const testUser = {
        firstName: 'James',
        lastName: 'Jackson',
        email: 'james123@example.com',
        password: 'JamesIsc00l123',
      };

      accountServices.registerUser(testUser, seedUser.refCode)
        .then(user => {
          done(new Error('This should have thrown InsecurePassword'));
        })
        .catch(e => {
          expect(e instanceof errors.InsecurePassword).to.be.true;
          done();
        });

    });

    it('throws InvalidReferral error when referall does not exist', done => {

      const testUser = {
        firstName: 'James',
        lastName: 'Jackson',
        email: 'james123@example.com',
        password: 'JamesIsc00l123$',
      };

      accountServices.registerUser(testUser, 'randomrefcode')
        .then(user => {
          done(new Error('This should have thrown InvalidReferral'));
        })
        .catch(e => {
          expect(e instanceof errors.InvalidReferral).to.be.true;
          done();
        });

    });

    it('bypasses referall when param true', done => {

      const testUser = {
        firstName: 'James',
        lastName: 'Jackson',
        email: 'james123@example.com',
        password: 'JamesIsc00l123$',
      };

      accountServices.registerUser(testUser, null, true)
        .then(user => {
          expect(user.meta.refferredBy).to.equal(null);
          done();
        })
        .catch(e => done(e));

    });

    it('throws EmailAlreadyExists error on duplicate email', done => {

      const testUser = {
        firstName: 'James',
        lastName: 'Jackson',
        email: seedUser.email,
        password: 'JamesIsc00l123@',
      };

      accountServices.registerUser(testUser, seedUser.refCode)
        .then(user => {
          done(new Error('This should have thrown EmailAlreadyExists'));
        })
        .catch(e => {
          expect(e instanceof errors.EmailAlreadyExists).to.be.true;
          done();
        });

    });

  });

  describe('authenticateUser', () => {

    let seedUser = null;
    const rawSeedUserPassword = users[0].password;
    beforeEach(async () => {
      // seed existing user into db to satisfy refCode search
      seedUser = await accountServices.registerUser(users[0], null, true);
    });

    it('finds user with valid credentials', (done) => {

      accountServices.authenticateUser(users[0].email, rawSeedUserPassword)
        .then(user => {
          expect(user).to.have.property('id');
          done();
        })
        .catch(e => done(e));

    });

  });

});
