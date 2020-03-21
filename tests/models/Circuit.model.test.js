const _ = require('lodash');
const { expect } = require('chai');
const { ObjectId } = require('mongodb');

const { FailedTest } = require('../../Errors');
const database = require('../../models/database');
const Circuit = require('../../models/Circuit.model');
const circuits = require('../fixtures/circuit.fixture');

describe('Circuit Model', () => {

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
    await Circuit.deleteMany({});
  });

  it('should save a circuit', done => {

    const testCircuit = _.clone(circuits[0]);
    new Circuit(testCircuit).save()
      .then(circuit => {
        expect(circuit).to.exist;
        expect(circuit).to.have.property('id');
        done();
      })
      .catch(e => done(e));

  });

  it('should not allow 2 circuits w/ same name', async () => {

    const circuit1 = await new Circuit(_.clone(circuits[0])).save();

    try {
      await new Circuit(_.clone(circuits[0])).save();
      throw new FailedTest('Should have thrown unique error');
    } catch (e) {
      expect(e instanceof FailedTest).to.not.be.true;
      expect(e.code).to.equal(11000);
    }

  });

  it('should allow 2 circuits w/ null overseer id', async () => {

    // await Circuit.collection.dropAllIndexes();
    const circuit1 = await new Circuit(_.clone(circuits[1])).save();
    const circuit2 = await new Circuit(_.clone(circuits[2])).save();
    expect(circuit2).to.exist;

  });

  it('should not allow 2 circuits w/ overseerId', async () => {

    const overseerId = new ObjectId();
    const circuit1 = _.clone(circuits[0]);
    circuit1.overseerId = overseerId;
    const circuit2 = _.clone(circuits[1]);
    circuit2.overseerId = overseerId;

    await new Circuit( circuit1 ).save();

    try {
      await new Circuit( circuit2 ).save();
      throw new FailedTest('Should have thrown unique error');
    } catch (e) {
      expect(e instanceof FailedTest).to.not.be.true;
      expect(e.code).to.equal(11000);
    }

  });

  it('should not allow invalid circuit name format', async () => {

    const circuit = _.clone(circuits[0]);
    circuit.name = 'PAA-16';
    try {
      await new Circuit(circuit).save();
      throw new FailedTest('Should have failed name regex validation');
    } catch (e) {
      expect(e instanceof FailedTest).to.not.be.true;
    }

  });

  it('should always capitalize circuit name', done => {

    const testCircuit = _.clone(circuits[0]);
    testCircuit.name = 'pa-16';
    new Circuit(testCircuit).save()
      .then(circuit => {
        expect(circuit.name).to.equal('PA-16');
        done();
      })
      .catch(e => done(e));

  });

  describe('Statics', () => {

    it('should find circuit by overseer id', async () => {

      const overseerId = new ObjectId();
      const seedCircuit = new Circuit(_.clone(circuits[0]));
      seedCircuit.overseerId = overseerId;
      const claimedCircuit = await seedCircuit.save();

      const foundCircuit = await Circuit.findByOverseer(overseerId);
      expect(foundCircuit).to.exist;
      expect(foundCircuit.overseerId.equals(overseerId)).to.be.true;

    });

  });

});
