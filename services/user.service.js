const _ = require('lodash');

const { OverseerAlreadyClaimed, CircuitAlreadyClaimed } = require('../Errors');

const CircuitModel = require('../models/Circuit.model');

exports.claimCircuit = async (user, circuitName) => {
  let summary = {};
  _.defaultsDeep(summary, {
    newCircuit: false,
    circuitId: null,
  });

  // assure CO is not already assigned to another circuit
  if (user.circuitId !== null) {
    throw new OverseerAlreadyClaimed(
      `Overseer has already claimed circuit ${user.circuitId.name ||
        user.circuitId}.`
    );
  }

  // find circuit
  let circuit = await CircuitModel.findByName(circuitName);
  // create circuit if doesn't exist
  if (!circuit) {
    circuit = await new CircuitModel({ name: circuitName }).save();
    summary.newCircuit = true;
  }

  // assign to user
  user.circuitId = circuit.id;

  // attempt to save user
  try {
    await user.save();
  } catch (e) {
    if (e.code && e.code === 11000) {
      throw new CircuitAlreadyClaimed(
        `Overseer with id ${overseerId} has already claimed another circuit.`
      );
    } else {
      throw e;
    }
  }

  summary.circuitId = circuit.id;
  return summary;
};
