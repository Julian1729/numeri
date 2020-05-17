const _ = require('lodash');
const { expect } = require('chai');
const { ObjectId } = require('mongodb');

const database = require('../../../models/database');
const { visitModel, publisherModel } = require('../../../models');
const StatCalculator = require('../../../helpers/classes/StatCalculator');
const visits = require('../../fixtures/visits.fixture');
const publishers = require('../../fixtures/publishers.fixture');

describe('StatCalculator', () => {
  let congregationId = new ObjectId();
  let visitId = new ObjectId();
  let visit = _.cloneDeep(visits[0]);
  // set congregationId in visit
  visit.congregationId = congregationId;
  visit._id = visitId;
  // set all publisher visitIds
  let visitPublishers = _.cloneDeep(publishers).map(publisher => {
    publisher.visitId = visitId;
    publisher.publisherId = new ObjectId();
    return publisher;
  });
  // console.log(JSON.stringify(visitPublishers, null, 2));

  before(async () => {
    // use test database
    process.env.MONGODB_URI = 'mongodb://localhost:27017/NumeriTest';
    await database();
    await visitModel.deleteMany({});
    await publisherModel.deleteMany({});
    // await publisherModel.collection.dropIndexes({}); // why do I need this?
    // await Promise.all(
    await visitModel.create(visit);
    await publisherModel.create(visitPublishers);
    // );
  });

  it('should have seeded correct fixtures', done => {
    visitModel
      .findById(visitId)
      .then(visit => {
        expect(visit).to.exist;
        return publisherModel.find({});
      })
      .then(publishers => {
        expect(publishers).to.have.lengthOf(3);
        done();
      })
      .catch(e => done());
  });

  describe('_isInactive', () => {
    it('should be inactive 1', () => {
      const statCalculator = new StatCalculator();
      const res = statCalculator._isInactive([1, 2, 3, 4, 5, 6, 7, 8]);
      expect(res).to.be.true;
    });
    it('should be inactive 2', () => {
      const statCalculator = new StatCalculator();
      const res = statCalculator._isInactive([11, 12, 13, 14, 15, 16]);
      expect(res).to.be.true;
    });
    it('should not be inactive 1', () => {
      const statCalculator = new StatCalculator();
      const res = statCalculator._isInactive([11, 12, 13, 14, 15]);
      expect(res).to.be.false;
    });
    it('should not be inactive 2', () => {
      const statCalculator = new StatCalculator();
      const res = statCalculator._isInactive([9, 10, 11, 12, 14, 15]);
      expect(res).to.be.false;
    });
  });

  describe('_loopPublishers (lazy loggger)', () => {
    it('should loop through publishers and get totals', () => {
      const statCalculator = new StatCalculator();
      statCalculator._loopPublishers(visitPublishers);
      // console.log('totals', JSON.stringify(statCalculator.totals, null, 2));
    });
  });

  describe('_calculateHourAverages (lazy logger)', () => {
    it('should calculate averages', () => {
      const statCalculator = new StatCalculator();
      statCalculator.publishers = visitPublishers;
      statCalculator._loopPublishers(visitPublishers);
      statCalculator._calculateHourAverages();
      // console.log('averages', JSON.stringify(statCalculator.averages, null, 2));
    });
  });

  describe('lists (lazy logger)', () => {
    it('should create correct lists', () => {
      const statCalculator = new StatCalculator();
      statCalculator.publishers = visitPublishers;
      statCalculator._loopPublishers(visitPublishers);
      // console.log('lists', JSON.stringify(statCalculator.lists, null, 2));
    });
  });

  describe('_calculateMeetingAttendance', () => {
    it('should calculate correct meeting totals', () => {
      const statCalculator = new StatCalculator(visit);
      statCalculator.publishers = visitPublishers;
      statCalculator._calculateMeetingAttendance();
      // console.log(
      //   'totals/meetingAttendance',
      //   JSON.stringify(statCalculator.totals.meetingAttendance, null, 2)
      // );
      // console.log(
      //   'averages/meetingAttendance',
      //   JSON.stringify(statCalculator.averages.meetingAttendance, null, 2)
      // );
    });
  });

  // should collect publishers
  describe('collect', () => {
    it('should collect visit publishers', async () => {
      const statCalculator = new StatCalculator(visit);
      await statCalculator.collect();
      expect(statCalculator.publishers).to.have.lengthOf.above(1);
    });
  });
});
