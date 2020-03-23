const _ = require('lodash');

const { CircuitAlreadyClaimed, OverseerAlreadyClaimed } = require('../Errors');
const Circuit = require('../models/Circuit.model');

/**
 * Find an overseers claimed circuit
 * @param  {mixed}  id  Overseers id
 * @return {Promise}    Found circuit
 */
exports.findClaimedCircuit = async id => {

  const circuit = await Circuit.findByOverseer(id);
  return circuit;

};

exports.claimCircuit = async (overseerId, circuitName) => {

  let summary = {};
  _.defaultsDeep(summary, {
    newCircuit: false,
    circuitId: null,
  });

  // search for circuit
  let circuit = await Circuit.findByName(circuitName);

  // assure circuit is not claimed
  if(circuit && !_.isNull(circuit.overseerId)){
    throw new CircuitAlreadyClaimed(`Circuit ${circuit.name} is already claimed by another CO.`);
  }

  try {

    // create circuit if doesn't exist
    if(!circuit){
      circuit = await new Circuit({ name: circuitName, overseerId }).save();
      summary.newCircuit = true;
    }else{
      // set new overseer for existing circuit
      circuit.overseerId = overseerId;
      await circuit.save();
    }

  } catch (e) {

    if(e.code && e.code === 11000){
      throw new OverseerAlreadyClaimed(`Overseer with id ${overseerId} has already claimed another circuit.`);
    }else{
      throw e;
    }

  }

  summary.circuitId = circuit.id;
  return summary;

}
