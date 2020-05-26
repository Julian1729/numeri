const _ = require('lodash');
const { expect } = require('chai');

const database = require('../../models/database');
const seed = require('../../config/seeder.config');
const visitServices = require('../../services/visits.services');
const congregations = require('../../data/1_congregations/congregations');
const Congregation = require('../../models/Congregation.model');
const Visit = require('../../models/Visit.model');
const visits = require('../../data/4_visits/visits');

describe('Visit Services', () => {
  before(async () => {
    // process.env.MONGODB_URI = 'mongodb://localhost:27017/NumeriTest';
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

  describe('populateStats', () => {
    let visit = null;
    beforeEach(async () => {
      // find first seeded visit
      // console.log(visits[0]);
      visit = await Visit.findById(visits[0]._id);
      // console.log(visit);
    });

    it('collected stats should persist in database save', async () => {
      const populatedVisit = await visitServices.populateStats(visit);
      await populatedVisit.save();
      // retreive visit again
      const foundVisit = await Visit.findById(visit._id);
      // console.log(JSON.stringify(foundVisit, null, 2));
      expect(foundVisit.stats.totals).to.not.be.empty;
      expect(foundVisit.stats.averages).to.not.be.empty;
      expect(foundVisit.stats.lists).to.not.be.empty;
      expect(visit.stats.lists).to.not.be.empty;
    });
  });
  describe('findPublishers', () => {
    let visit = null;
    beforeEach(async () => {
      // find first seeded visit
      // console.log(visits[0]);
      visit = await Visit.findById(visits[0]._id);
      // console.log(visit);
    });
    it('should find all visit publishers', done => {
      visitServices
        .findPublishers(visit)
        .then(publishers => {
          expect(publishers).to.have.lengthOf(50);
          done();
        })
        .catch(e => done(e));
    });
    it('should find all visit publishers with id', done => {
      visitServices
        .findPublishers(visit._id)
        .then(publishers => {
          // console.log(JSON.stringify(_.map(publishers, 'firstName'), null, 2));
          expect(publishers).to.have.lengthOf(50);
          done();
        })
        .catch(e => done(e));
    });
    // it('should find all visit publishers with extra query', done => {
    //   visitServices
    //     .findPublishers(visit, { query: { appointment: 'ms' } })
    //     .then(publishers => {
    //       console.log('ms found', publishers.length);
    //
    //       done();
    //     })
    //     .catch(e => done(e));
    // });
  });
});
