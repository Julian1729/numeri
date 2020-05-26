const _ = require('lodash');

const visitServices = require('../services/visits.services');

exports.list = async (req, res, next) => {
  const { congregation, skip, limit } = req.query;

  // find visits with filters
  const visits = await visitServices.findVisits({
    congregation,
    skip,
    limit,
    fields: 'startDate endDate congregationId congregation importMethod',
    findPreviousVisits: 'startDate',
  });

  return res
    .ApiResponse()
    .data('visits', visits)
    .send();
};

exports.getVisit = async (req, res, next) => {
  let visit = res.locals.visit;
  let { findPrev, fields } = req.query;

  let previousVisit = null;
  if (findPrev) {
    previousVisit = await visit.findPreviousVisit();
    if (previousVisit) {
      // assure previous visit has stats
      if (!previousVisit.hasStats()) {
        await visitServices.populateStats(previousVisit);
        await previousVisit.save();
      }
    }
  }
  if (req.query.fields) {
    // convert to plain object
    visit = visit.toObject();
    // convert fields into array and push in
    // previousVisit to include if applicable
    fields = fields.split(' ');
    visit = _.pick(visit, fields);
  }

  // attach prevous visit to plain object
  if (findPrev) {
    visit.previousVisit = previousVisit;
  }

  res
    .ApiResponse()
    .data('visit', visit)
    .send();
};

/**
 * Populate or refresh stat calculation
 * on a visit
 */
exports.getStats = async (req, res, next) => {
  const populatedVisit = await visitServices.populateStats(res.locals.visit);

  await populatedVisit.save();

  const ApiResponse = res.ApiResponse();

  ApiResponse.data('totals', populatedVisit.stats.totals);
  ApiResponse.data('averages', populatedVisit.stats.averages);
  ApiResponse.data('lists', populatedVisit.stats.lists);
  ApiResponse.send();
};

exports.getPublishers = async (req, res, next) => {};
