const _ = require('lodash');

const Visit = require('../models/Visit.model');

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
  // find last visit month, and count up to this visit's
  // month to get the months this visit is looking for
  // if previous visit doesnt exist, grab last 6 months
};
