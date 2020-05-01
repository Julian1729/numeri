const _ = require('lodash');
const casual = require('casual');
const moment = require('moment');
const { ObjectId } = require('mongodb');

const visits = require('../4_visits/visits');
const momentHelpers = require('../../helpers/moment.helpers');

const generateServiceReports = (pioneerStatus, last6Months) => {
  const serviceReports = [];
  switch (pioneerStatus) {
    case 'regular':
      last6Months.forEach(monthMoment => {
        serviceReports.push({
          month: monthMoment.month(),
          year: monthMoment.year(),
          minutes:
            [casual.integer(60, 70), casual.integer(65, 95)][_.random(0, 1)] *
            60,
          placements: casual.integer(0, 20),
          videos: casual.integer(0, 8),
          returnVisits: casual.integer(2, 15),
          studies: [0, casual.integer(0, 4)][_.random(0, 1)],
        });
      });
      break;
    case 'aux':
      last6Months.forEach(monthMoment => {
        serviceReports.push({
          month: monthMoment.month(),
          year: monthMoment.year(),
          minutes:
            [casual.integer(46, 50), casual.integer(55, 65)][_.random(0, 1)] *
            60,
          placements: casual.integer(0, 10),
          videos: casual.integer(0, 5),
          returnVisits: casual.integer(1, 9),
          studies: [0, 0, casual.integer(0, 2)][_.random(0, 2)],
        });
      });
      break;
    case 'special':
      last6Months.forEach(monthMoment => {
        serviceReports.push({
          month: monthMoment.month(),
          year: monthMoment.year(),
          minutes:
            [casual.integer(90, 100), casual.integer(102, 110)][
              _.random(0, 1)
            ] * 60,
          placements: casual.integer(0, 25),
          videos: casual.integer(0, 10),
          returnVisits: casual.integer(4, 20),
          studies: casual.integer(0, 2),
        });
      });
      break;
    default:
      // regular publisher
      last6Months.forEach(monthMoment => {
        serviceReports.push({
          month: monthMoment.month(),
          year: monthMoment.year(),
          minutes:
            [casual.integer(5, 15), casual.integer(20, 35)][_.random(0, 1)] *
            60,
          placements: casual.integer(0, 10),
          videos: casual.integer(0, 5),
          returnVisits: casual.integer(1, 9),
          studies: [0, 0, casual.integer(0, 2)][_.random(0, 2)],
        });
      });
  }
  return serviceReports;
};

const generatePublishers = (count = 1) => {
  const publishers = [];
  for (let i = 0; i < count; i++) {
    let publisher = {
      publisherId: new ObjectId(),
      firstName: casual.first_name,
      lastName: casual.last_name,
      gender: ['male', 'female'][_.random(0, 1)],
      appointment: null,
      pioneerStatus: null,
      baptized: null,
      anointed: null,
      // FIXME: this has not been implemented yet, set all to 1
      status: 1,
      meta: {},
      serviceReports: null,
    };
    if (!publisher.appointment) {
      publisher.baptized = casual.coin_flip;
    }
    if (publisher.baptized) {
      if (publisher.male) {
        // FIXME: give lower odds
        publisher.appointment = ['elder', 'ms', null][_.random(0.1)];
      }
      // give publisher low chanced of being annointed
      const anointedChance = casual.integer(1, 120);
      if (anointedChance >= 50 && anointedChance <= 60) {
        publisher.anointed = true;
      }
      // give publisher chances of being a pioneer
      const pioneerChance = casual.integer(0, 170);
      if (pioneerChance >= 95 && pioneerChance <= 100) {
        publisher.pioneerStatus = 'special';
      } else if (pioneerChance >= 50 && pioneerChance < 90) {
        publisher.poineerStatus = 'regular';
      } else if (pioneerChance >= 35 && pioneerChance <= 45) {
        publisher.poineerStatus = 'aux';
      }
    }
    publishers.push(publisher);
  }
  return publishers;
};

const populatePublishersVisitData = (publishers, visit) => {
  const last6Months = momentHelpers.getLast6Months(visit.startDate);
  return publishers.map(publisher => {
    publisher.visitId = visit._id;
    publisher.serviceReports = generateServiceReports(
      publisher.pioneerStatus,
      last6Months
    );
    return publisher;
  });
};

// organize visits by congregation _id {congregationId: [visits]}
const visitMap = {};

visits.forEach(visit => {
  let congregationVisits = visitMap[visit.congregationId];
  if (!congregationVisits) {
    congregationVisits = visitMap[visit.congregationId] = [];
  }
  congregationVisits.push(visit);
});

// return console.log(visitMap);

let publishers = []; // all publishers

// run through map and generate publishers
for (let congregation in visitMap) {
  if (visitMap.hasOwnProperty(congregation)) {
    const visits = visitMap[congregation];
    let congregationPublishers = generatePublishers(50);
    visits.forEach(visit => {
      // populate publisher random data for this visit
      const congregationPopulatedPublishers = populatePublishersVisitData(
        congregationPublishers,
        visit
      );
      publishers = publishers.concat(congregationPopulatedPublishers);
    });
  }
}

module.exports = publishers;
