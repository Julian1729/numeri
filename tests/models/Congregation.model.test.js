const _ = require('lodash');
const { expect } = require('chai');

const database = require('../../models/database');
const congregations = require('../fixtures/congregations.fixture');
const Congregation = require('../../models/Congregation.model');

describe('Congregation Model', () => {
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
    await Congregation.deleteMany({});
  });

  it('should save a congregation', done => {
    new Congregation(_.cloneDeep(congregations[0]))
      .save()
      .then(congregation => {
        expect(congregation).to.exist.and.to.have.property('_id');
        done();
      })
      .catch(e => done(e));
  });
});
