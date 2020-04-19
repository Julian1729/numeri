const circuitServices = require('../services/circuit.service');
const { congregationModel, userModel, circuitModel } = require('../models');

exports.findCircuit = async (req, res, next) => {
  const claimedCircuit = await circuitServices.findClaimedCircuit(req.user._id);
  if (!claimCircuit) {
    return res.ApiResponse().error('');
  }
  next();
};
