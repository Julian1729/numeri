const _ = require('lodash');
const HttpStatusCodes = require('http-status-codes');

const visitServices = require('../services/visits.services');

// FIXME: not unit tested
exports.findVisit = async (req, res, next) => {
  const visitId = req.params.visitId;
  const visit = await visitServices.getVisit(visitId, {
    populate: { path: 'congregation' },
    // findPreviousVisits: true,
  });
  if (!visit) {
    return res.send(HttpStatusCodes.NOT_FOUND).send();
  }

  res.locals.visit = visit;
  next();
};

exports.populateStats = async (req, res, next) => {
  // if no visit data imported skip
  if (res.locals.visit.importMethod === 0) return next();

  const visit = res.locals.visit;

  if (
    _.isEmpty(visit.averages) ||
    _.isEmpty(visit.lists) ||
    _.isEmpty(visit.totals)
  ) {
    res.locals.visit = await visitServices.populateStats(visit);
  }

  // call populate stats service
  const populatedVisit = await visitServices.populateStats(visit);
  populatedVisit.save(); // we do not need to await for this to save
  next();
};

/**
 * Assure that data has been
 * populated into visit
 */
exports.shouldBePopulated = (req, res, next) => {
  // if no visit data imported return api error
  if (res.locals.visit.importMethod === 0) {
    return res
      .ApiResponse()
      .error(
        'EMPTY_VISIT',
        `No data has been imported yet for visit with ID ${res.locals.visit._id}`
      );
  }
  next();
};
