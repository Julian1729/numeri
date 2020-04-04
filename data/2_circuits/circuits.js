const casual = require('casual');
const { ObjectId } = require('mongodb');

const users = require('../1_users/users');

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
  overseerId: null,
  meta: {
    previousOverseers: [],
  },
  id: new ObjectId(),
}));

const circuits = [
  {
    name: 'PA-16',
    // attach to James Jackson
    overseerId: users[1].id,
    meta: {
      previousOverseers: [new ObjectId(), new ObjectId()],
    },
    id: new ObjectId(),
  },
  {
    name: `${casual.state_abbr}-${casual.circuit_number}`,
    overseerId: users[0].id,
    meta: {
      previousOverseers: [],
    },
    id: new ObjectId(),
  },
  {
    name: `${casual.state_abbr}-${casual.circuit_number}`,
    overseerId: users[2].id,
    meta: {
      previousOverseers: [],
    },
    id: new ObjectId(),
  },
  casual.circuit,
  casual.circuit,
  casual.circuit,
];

module.exports = circuits;
