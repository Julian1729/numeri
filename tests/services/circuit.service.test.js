const _ = require('lodash');
const chai = require('chai');
const asserttype = require('chai-asserttype');
chai.use(asserttype);
const expect = chai.expect;
const { ObjectId } = require('mongodb');

const errors = require('../../Errors');
const users = require('../fixtures/users.fixture');
const circuits = require('../fixtures/circuit.fixture');
const circuitService = require('../../services/circuit.service');
const { circuitModel, userModel } = require('../../models');

describe('Circuit Service', () => {

  describe('claimCircuit', () => {

    let seedOverseer = null;
    let seedCircuit = null;
    beforeEach( async () => {

      await circuitModel.deleteMany({});
      await userModel.deleteMany({});
      seedCircuit = await circuitModel.create(circuits[1]);
      seedOverseer = await userModel.create(users[0]);

    });

    it('should claim circuit', async () => {

      const result = await circuitService.claimCircuit(seedOverseer.id, circuits[1].name);
      expect(result.newCircuit).to.be.false;
      expect(ObjectId.isValid(result.circuitId)).to.be.true;

    });

    it('should create new circuit and claim', done => {

      const newCircuitName = 'NJ-45';
      circuitService.claimCircuit(seedOverseer.id, newCircuitName)
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

      seedCircuit.overseerId = seedOverseer.id;
      await seedCircuit.save();
      try {
        await circuitService.claimCircuit(new ObjectId(), seedCircuit.name);
        throw new errors.FailedTest('Should have thrown CircuitAlreadyClaimed')
      } catch (e) {
        expect(e instanceof errors.CircuitAlreadyClaimed).to.be.true;
      }

    });

    it('should throw OverseerAlreadyClaimed', async () => {

      // 2nd circuit
      const circuit2 = _.clone(circuits[2]);
      circuit2.overseerId = seedOverseer.id;
      await circuitModel.create(circuit2);
      try {
        await circuitService.claimCircuit(seedOverseer.id, seedCircuit.name);
        throw new errors.FailedTest('Should have thrown OverseerAlreadyClaimed')
      } catch (e) {
        expect(e instanceof errors.OverseerAlreadyClaimed).to.be.true;
      }

    });

  });

});
