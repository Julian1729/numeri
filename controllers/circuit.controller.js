const HttpStatusCodes = require('http-status-codes');

const errors = require('../Errors');
const { circuitServices } = require('../services');

exports.claimCircuit = async (req, res, next) => {
  const { state = '', number = '' } = req.body;
  if (!state || !number) {
    return res.status(HttpStatusCodes.BAD_REQUEST).send();
  }

  const circuitName = `${state}-${number}`;

  let result = null;

  try {
    result = await circuitServices.claimCircuit(req.user.id, circuitName);
  } catch (e) {
    if (e instanceof errors.CircuitAlreadyClaimed) {
      return res
        .ApiResponse()
        .error('CIRCUIT_NOT_AVAILABLE', null, { circuitName })
        .send();
    } else if (e instanceof errors.OverseerAlreadyClaimed) {
      console.log(e.message);
      return res
        .ApiResponse()
        .error('OVERSEER_NOT_AVAILABLE')
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
