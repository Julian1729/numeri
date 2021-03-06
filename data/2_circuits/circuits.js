const _ = require('lodash');
const casual = require('casual');
const { ObjectId } = require('mongodb');

const congregations = require('../1_congregations/congregations.js');

const congregationClones = _.cloneDeep(congregations);

const takenCircuitNumbers = [16];

// FIXME: this is actually broken, should check name to
// but will probably never be a problem, becuase we probably
// wont ever insert over 99 circuits to seed
casual.define('circuit_number', () => {
  let num = null;
  do {
    num = casual.integer(1, 99);
  } while (takenCircuitNumbers.indexOf(num) !== -1);
  takenCircuitNumbers.push(num);
  return num;
});

casual.define('circuit', () => ({
  name: `${casual.state_abbr}-${casual.circuit_number}`,
  congregations: [],
  meta: {
    previousOverseers: [],
  },
  _id: new ObjectId(),
}));

let pa16 = {
  name: 'PA-16',
  congregations: [congregations[0]._id, congregations[1]._id],
  meta: {
    previousOverseers: [],
  },
  _id: new ObjectId(),
};

const circuits = [
  casual.circuit,
  casual.circuit,
  casual.circuit,
  casual.circuit,
  casual.circuit,
];

// push 25 more congregations into PA-16
for (let i = 0; i < 25; i++) {
  pa16.congregations.push(congregationClones.pop()._id);
}

// divide the rest of the congregations into the rest of the circuits
const circuitAmount = Math.floor(congregationClones.length / circuits.length);
let congregationBundles = _.chunk(congregationClones, circuitAmount);
// reduce congregationBundles to ids
congregationBundles = congregationBundles.map(bundle =>
  bundle.map(({ _id }) => _id)
);
circuits.forEach(circuit => {
  circuit.congregations = congregationBundles.shift();
});
// add remaining congregations to first circuit
congregationBundles.forEach(bundle =>
  circuits[0].congregations.push(...bundle)
);
// push pa16 into circuits at beginning
circuits.unshift(pa16);

module.exports = circuits;
