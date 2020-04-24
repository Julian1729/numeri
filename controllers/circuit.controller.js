const HttpStatusCodes = require('http-status-codes');

const errors = require('../Errors');
const { userServices } = require('../services');

exports.claimCircuit = async (req, res, next) => {
  const { state = '', number = '' } = req.body;
  if (!state || !number) {
    return res.status(HttpStatusCodes.BAD_REQUEST).send();
  }

  const circuitName = `${state}-${number}`;

  let result = null;

  try {
    result = await userServices.claimCircuit(req.user, circuitName);
  } catch (e) {
    if (e instanceof errors.CircuitAlreadyClaimed) {
      return res
        .ApiResponse()
        .error('CIRCUIT_NOT_AVAILABLE', null, { circuitName })
        .send();
    } else if (e instanceof errors.OverseerAlreadyClaimed) {
      return res
        .ApiResponse()
        .error('OVERSEER_ALREADY_ASSIGNED')
        .send();
    } else {
      next(e);
    }
  }

  return res
    .ApiResponse()
    .data('circuit', {
      id: result.circuitId,
      new: result.newCircuit,
      name: circuitName,
    })
    .data('redirect', '/dashboard')
    .send();
};
