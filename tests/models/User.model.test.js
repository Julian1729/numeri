const { expect } = require('chai');
const mongoose = require('mongoose');

const User = require('../../models/User.model');
const database = require('../../models/database');
const users = require('../fixtures/users.fixture');

describe('User Model', () => {

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

  it('should save a user model', (done) => {

    const testUserData = {
      firstName: 'Julian',
      lastName: 'Hernandez',
      email: 'Email@example.com',
      password: 'ThisGoodPass123@',
      refCode: '45xyz89',
    };
    const testUser = new User(testUserData);

    testUser.save()
      .then(user => {
        expect(user).to.exist;
        // should have converted email to lowercase
        expect(user.email).to.eql('email@example.com');
        // should have hashed passowrd before save
        expect(user.password).to.not.equal(testUserData.password);
        expect(user.refCode).to.not.be.null;
        expect(user.meta).to.have.property('referredBy');
        expect(user.meta).to.have.property('tokens');
        done();
      })
      .catch(e => done(e));

  });

  it('should not save a user model for missing first name', (done) => {

    const testUser = new User({
      firstName: '',
      lastName: 'Hernandez',
      email: 'Email@example.com',
      password: 'thisomerandompassword123',
      refCode: '45xyz89',
      meta: {},
    });

    testUser.save()
      .then(user => {
        done(new Error('This should have failed with required name error'));
      })
      .catch(e => {
        done();
      });

  });

  describe('Virtuals', () => {

    it('gets full name', () => {

      const testUser = new User({
        firstName: 'Julian',
        lastName: 'Hernandez',
        email: 'Email@example.com',
        password: 'thisomerandompassword123',
        refCode: '45xyz89',
        meta: {},
      });

      expect(testUser.name).to.equal('Julian Hernandez');

    });

  });

  describe('Statics', () => {

    it('finds user by referral code', async () => {

      // insert test user
      const testUser = new User(users[0]);
      const user = await testUser.save();

      // search for user by ref code
      const foundUser = await User.findReferral(user.refCode);
      expect(foundUser).to.have.property('id');
      expect(foundUser.id.toString()).to.equal(user.id.toString());

    });

    it('does not return on invalid referall code', async () => {

      // search for user by ref code
      const foundUser = await User.findReferral(users[0].refCode);
      expect(foundUser).to.equal(null);

    });

  });

  describe('Methods', () => {

    it('validates user raw password to hash', async () => {

      // insert test user
      const rawPassword = users[0].password;
      const testUser = await new User(users[0]).save();
      expect(testUser.password).to.not.equal(rawPassword);

      const passResult = await testUser.validatePassword(rawPassword);
      expect(passResult).to.eql(true);

      const failResult = await testUser.validatePassword('badpass');
      expect(failResult).to.eql(false);

    });

  });

});
