const _ = require('lodash');
const HttpStatusCodes = require('http-status-codes');

exports.checkVisitAuthorization = (req, res, next) => {
  const { congregationId } = res.locals.visit;
  const congregation = _.find(req.user.circuit.congregations, ({ _id }) =>
    _id.equals(congregationId)
  );
  if (!congregation) {
    return res.status(HttpStatusCodes.UNAUTHORIZED).send();
  }
  res.locals.congregation = congregation;
  next();
};
