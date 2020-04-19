const visitServices = require('../services/visits.services');

exports.list = async (req, res, next) => {
  const { congregation, skip, limit } = req.params;

  // find visits with filters
  const visits = await visitServices.findVisits({
    congregation,
    skip,
    limit,
  });

  return res
    .ApiResponse()
    .data('visits', visits)
    .send();
};
