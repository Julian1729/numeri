const _ = require('lodash');
const mongoose = require('mongoose');

const Visit = require('../models/Visit.model');
const Publisher = require('../models/Publisher.model');
const StatCalculator = require('../helpers/classes/StatCalculator');

exports.findVisits = async (options = {}) => {
  _.defaults(options, {
    congregation: null,
    fields: null,
    startDate: null,
    endDate: null,
    skip: null,
    limit: null,
    findPreviousVisits: false,
    sort: { startDate: 'desc' }, // desc > newest to oldest
  });

  // prepping for startDate and endDate integration
  const query = {};
  if (options.congregation) {
    query.congregationId = options.congregation;
  }
  const dbQuery = Visit.find(query, options.fields)
    .populate('congregation')
    .sort(options.sort);

  // OPTIMIZE: https://stackoverflow.com/questions/5539955/how-to-paginate-with-mongoose-in-node-js/23640287#23640287
  if (options.skip) {
    dbQuery.skip(options.skip);
  }

  // default to 25 visits
  dbQuery.limit(options.limit || 25);

  let visits = await dbQuery.exec();

  if (options.findPreviousVisits) {
    prevVisitQueries = visits.map(async visit => {
      visit.previousVisit = await visit.findPreviousVisit(
        typeof options.findPreviousVisits === 'string'
          ? options.findPreviousVisits
          : null
      );
      return visit;
    });

    visits = await Promise.all(prevVisitQueries);
  }

  return visits;
};

exports.getVisit = async (visitId, options = {}) => {
  const { fields, findPreviousVisits } = options;
  delete options.fields;
  delete options.findPreviousVisits;
  let visit = await Visit.findById(visitId, fields, options);
  if (findPreviousVisits) {
    visit.previousVisit = await visit.findPreviousVisit();
  }
  return visit;
};

exports.populateStats = async visit => {
  if (visit instanceof mongoose.Model !== true) {
    console.log(visit);
    throw new TypeError('populateStats expecting param to be Visit object');
  }
  const statCalc = new StatCalculator(visit);
  await statCalc.collect();
  statCalc.calculate();
  // console.log(
  //   JSON.stringify(
  //     {
  //       totals: statCalc.totals,
  //       averages: statCalc.averages,
  //       lists: statCalc.lists,
  //     },
  //     null,
  //     2
  //   )
  // );
  visit.stats.totals = statCalc.totals;
  visit.stats.averages = statCalc.averages;
  visit.stats.lists = statCalc.lists;
  visit.markModified('stats');
  return visit;
};

exports.findPublishers = async (visit, options = {}) => {
  let visitId = visit;
  if (visit instanceof mongoose.Model) {
    visitId = visit.id || visit._id;
  }
  _.defaults(options, {
    sort: { lastName: 'asc' },
    fields: null,
    skip: null,
    limit: null,
    query: {},
  });

  const dbQuery = Publisher.find({ ...options.query, visitId }, options.fields);

  dbQuery.sort(options.sort);

  dbQuery.skip(options.skip);

  dbQuery.limit(options.limit);

  const publishers = await dbQuery.exec();

  return publishers;
};
