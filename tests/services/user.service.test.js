const _ = require('lodash');
const chai = require('chai');
const asserttype = require('chai-asserttype');
chai.use(asserttype);
const expect = chai.expect;
const { ObjectId } = require('mongodb');

const errors = require('../../Errors');
const database = require('../../models/database');
const users = require('../fixtures/users.fixture');
const circuits = require('../fixtures/circuit.fixture');
const userService = require('../../services/user.service');
const { circuitModel, userModel } = require('../../models');

describe('User Services', () => {
  before(async () => {
    // use test database
    process.env.MONGODB_URI = 'mongodb://localhost:27017/NumeriTest';
    await database();
  });

  after(() => {
    delete process.env.MONGODB_URI;
  });

  describe('claimCircuit', () => {
    let seedOverseer = null;
    let seedCircuit = null;
    beforeEach(async () => {
      await circuitModel.deleteMany({});
      await userModel.deleteMany({});
      seedCircuit = await circuitModel.create(circuits[1]);
      seedOverseer = await userModel.create(users[1]);
    });

    it('should claim circuit', async () => {
      const result = await userService.claimCircuit(
        seedOverseer,
        circuits[1].name
      );
      expect(result.newCircuit).to.be.false;
      expect(ObjectId.isValid(result.circuitId)).to.be.true;
    });

    it('should create new circuit and claim', done => {
      const newCircuitName = 'NJ-45';
      userService
        .claimCircuit(seedOverseer, newCircuitName)
        .then(result => {
          expect(result.newCircuit).to.be.true;
          expect(ObjectId.isValid(result.circuitId)).to.be.true;
          return circuitModel.findByName(newCircuitName);
        })
        .then(newCircuit => {
          expect(newCircuit).to.exist;
          expect(newCircuit.name).to.eql(newCircuitName);
          done();
        })
        .catch(e => done(e));
    });

    it('should throw CircuitAlreadyClaimed', async () => {
      seedOverseer.circuitId = seedCircuit.id;
      await seedOverseer.save();
      // 2nd overseer
      const triggerOverseer = _.cloneDeep(users[1]);
      triggerOverseer.circuitId = seedCircuit.id;
      try {
        await userService.claimCircuit(triggerOverseer, seedCircuit.name);
        throw new errors.FailedTest('Should have thrown CircuitAlreadyClaimed');
      } catch (e) {
        console.log(e);
        expect(e instanceof errors.CircuitAlreadyClaimed).to.be.true;
      }
    });

    it('should throw OverseerAlreadyClaimed', async () => {
      seedOverseer.circuitId = seedCircuit.id;
      try {
        await userService.claimCircuit(seedOverseer, seedCircuit.name);
        throw new errors.FailedTest(
          'Should have thrown OverseerAlreadyClaimed'
        );
      } catch (e) {
        expect(e instanceof errors.OverseerAlreadyClaimed).to.be.true;
      }
    });
  });
});
