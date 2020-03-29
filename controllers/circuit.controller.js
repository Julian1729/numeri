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
      // find corresponding circuit
      const { name, id } = await circuitServices.findClaimedCircuit(
        req.user.id
      );
      return res
        .ApiResponse()
        .error('OVERSEER_ALREADY_ASSIGNED')
        .data('circuit', {
          name,
          id,
        })
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
