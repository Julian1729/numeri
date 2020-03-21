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
