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
