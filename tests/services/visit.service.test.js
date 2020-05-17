const _ = require('lodash');
const { expect } = require('chai');

const database = require('../../models/database');
const seed = require('../../config/seeder.config');
const visitServices = require('../../services/visits.services');
const congregations = require('../../data/1_congregations/congregations');
const Congregation = require('../../models/Congregation.model');

describe('Visit Services', () => {
  before(async () => {
    await seed();
    await database();
  });

  describe('findVisits', () => {
    it('should find congregation in db', done => {
      Congregation.findById(congregations[0]._id)
        .then(congregation => {
          expect(congregation.name).to.equal('Roosevelt');
          done();
        })
        .catch(e => done(e));
    });

    it('should find 2 visits for Roosevelt Congregation', async () => {
      const congregation = congregations[0]._id;
      const visits = await visitServices.findVisits({ congregation });
      expect(visits).to.have.lengthOf(2);
    });

    it('should find 4 visits', async () => {
      const visits = await visitServices.findVisits();
      expect(visits).to.have.lengthOf(4);
    });

    it('should populate virtual congregation field', async () => {
      const congregation = congregations[0]._id;
      const visits = await visitServices.findVisits({ congregation });
      expect(visits).to.have.lengthOf(2);
      expect(visits[0])
        .to.have.property('congregation')
        .and.to.have.property('name');
    });

    it('should skip 1 visit for Roosevelt Congregation', async () => {
      const congregation = congregations[0]._id;
      const visits = await visitServices.findVisits({ congregation, skip: 1 });
      expect(visits).to.have.lengthOf(1);
    });

    it('should limit to 1 visit for Roosevelt Congregation', async () => {
      const congregation = congregations[0]._id;
      const visits = await visitServices.findVisits({ congregation, limit: 1 });
      expect(visits).to.have.lengthOf(1);
    });

    it('should find previous visits for all visits', async () => {
      const congregation = congregations[0]._id;
      const visits = await visitServices.findVisits({
        congregation,
        findPreviousVisits: 'startDate',
      });
      expect(visits[1]).to.have.property('previousVisit');
    });
  });
});
