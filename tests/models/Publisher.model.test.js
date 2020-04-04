const _ = require('lodash');
const { expect } = require('chai');
const { ObjectId } = require('mongodb');

const errors = require('../../Errors');
const publishers = require('../fixtures/publishers.fixture');
const PublisherModel = require('../../models/Publisher.model');

describe('Publisher Model', () => {
  beforeEach(async () => {
    await PublisherModel.deleteMany({});
  });

  it('should save a publisher', done => {
    new PublisherModel(_.cloneDeep(publishers[0]))
      .save()
      .then(publisher => {
        expect(publisher).to.exist;
        expect(publisher.publisherId instanceof ObjectId).to.be.true;
        done();
      })
      .catch(e => done(e));
  });

  it('should not allow 2 publishers with same publisherId and visitId', async () => {
    // insert first publisher
    const testPublisher = _.cloneDeep(publishers[0]);
    const firstPublisher = await new PublisherModel(testPublisher).save();
    try {
      // explicitly give new id
      testPublisher._id = new ObjectId();
      await new PublisherModel(testPublisher).save();
      throw new errors.FailedTest('Should have thrown unique error');
    } catch (e) {
      expect(e instanceof errors.FailedTest).to.not.be.true;
      expect(e.code).to.eql(11000);
    }
  });

  it('should allow 2 publishers with same publisherId and differnt visitId', async () => {
    // insert first publisher
    const testPublisher = _.cloneDeep(publishers[0]);
    const firstPublisher = await new PublisherModel(testPublisher).save();
    // give new id and visitId
    testPublisher._id = new ObjectId();
    testPublisher.visitId = new ObjectId();
    await new PublisherModel(testPublisher).save();
    // find the 2 publishers for good measure
    const pubs = await PublisherModel.find({
      publisherId: testPublisher.publisherId,
    });
    expect(pubs).to.have.lengthOf(2);
  });
});
