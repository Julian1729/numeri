const _ = require('lodash');
const { expect } = require('chai');

const database = require('../../models/database');
const visits = require('../fixtures/visits.fixture');
const Visit = require('../../models/Visit.model');

describe('Visit Model', () => {
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
    await Visit.deleteMany({});
  });

  it('should save a visit', done => {
    new Visit(_.cloneDeep(visits[0]))
      .save()
      .then(visit => {
        expect(visit).to.have.property('_id');
        done();
      })
      .catch(e => done(e));
  });
});
