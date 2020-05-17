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

  let { averages, lists, totals } = res.locals.visit.stats;

  if (_.isEmpty(averages) || _.isEmpty(lists) || _.isEmpty(totals)) {
    res.locals.visit = await visitServices.populateStats(visit);
  }
};
