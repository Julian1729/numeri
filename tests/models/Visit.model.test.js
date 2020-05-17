const _ = require('lodash');
const { expect } = require('chai');
const moment = require('moment');
const { ObjectId } = require('mongodb');

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

  let visit1 = null;
  let visit2 = null;
  let visit3 = null;
  beforeEach(done => {
    const epoch = moment().isoWeekday('Tuesday');

    const baseVisit = {
      congregationId: new ObjectId(),
      startDate: epoch.toDate(),
      endDate: epoch.isoWeekday('Sunday').toDate(),
      importMethod: 1,
      meetingAttendance: [],
      stats: {},
    };

    Visit.deleteMany({})
      .then(() => {
        return Visit.create(baseVisit);
      })
      .then(visitOne => {
        visit1 = visitOne;
        epoch.add(6, 'months');
        return Visit.create({
          ...baseVisit,
          startDate: epoch.isoWeekday('Tuesday').toDate(),
          endDate: epoch.isoWeekday('Sunday').toDate(),
          importMethod: 2,
        });
      })
      .then(visitTwo => {
        visit2 = visitTwo;
        epoch.add(6, 'months');
        return Visit.create({
          ...baseVisit,
          startDate: epoch.isoWeekday('Tuesday').toDate(),
          endDate: epoch.isoWeekday('Sunday').toDate(),
          importMethod: 3,
        });
      })
      .then(visitThree => {
        visit3 = visitThree;
        done();
      })
      .catch(e => done(e));
  });

  it('beforeEach should have created 3 visits', () => {
    expect(visit1).to.have.property('_id');
    expect(visit2).to.have.property('_id');
    expect(visit3).to.have.property('_id');
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

  describe('Methods', () => {
    describe('findPreviousVisit', () => {
      it('should find visit2 as previous visit', done => {
        // console.log(JSON.stringify([visit1, visit2, visit3], null, 2));
        visit3
          .findPreviousVisit()
          .then(visit => {
            // console.log('vs', visit);
            expect(visit._id.equals(visit2._id)).to.be.true;
            done();
          })
          .catch(e => done(e));
      });
      it('should find visit1 as previous visit', done => {
        visit2
          .findPreviousVisit()
          .then(visit => {
            expect(visit._id.equals(visit1._id)).to.be.true;
            done();
          })
          .catch(e => done(e));
      });
      it('should not find a previous visit', done => {
        visit1
          .findPreviousVisit()
          .then(visit => {
            expect(visit).to.be.null;
            done();
          })
          .catch(e => done(e));
      });
    });
  });
});
