const _ = require('lodash');
const casual = require('casual');
const { ObjectId } = require('mongodb');

const circuits = require('../2_circuits/circuits');

// return console.log(JSON.stringify(circuits, null, 2));

const randomCircuitId = () => circuits[_.random(0, circuits.length - 1)].id;

let takenNames = ['Roosevelt', 'North English'];

casual.define('congregation_name', () => {
  let name = null;
  do {
    name = [casual.city, casual.company_name][_.random(0, 1)];
  } while (takenNames.indexOf(name) !== -1);
  takenNames.push(name);
  return name;
});

casual.define('congregation', () => ({
  name: casual.congregation_name,
  circuitId: randomCircuitId(),
  id: new ObjectId(),
}));

let congregations = [
  {
    name: 'Roosevelt',
    circuitId: circuits[0].id,
    id: new ObjectId(),
  },
  {
    name: 'North English',
    circuitId: circuits[0].id,
    id: new ObjectId(),
  },
];

for (var i = 0; i < 50; i++) {
  congregations.push(casual.congregation);
}

module.exports = congregations;
