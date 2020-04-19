const _ = require('lodash');

const Visit = require('../models/Visit.model');

exports.findVisits = async ({
  congregation,
  startDate = null,
  endDate = null,
  skip = null,
  limit = null,
}) => {
  // OPTIMIZE: https://stackoverflow.com/questions/5539955/how-to-paginate-with-mongoose-in-node-js/23640287#23640287
  // use this because startDate and endDate will be implemented in the future
  const query = { congregation };
  const dbQuery = Visit.find({ ...query });
  if (skip) {
    dbQuery.skip(skip);
  }
  if (limit) {
    dbQuery.limit(20);
  }
  // use spread with query to ignore undefined
  const visits = await dbQuery.exec();
  console.log(visits.length, ' visits');
  return visits;
};
