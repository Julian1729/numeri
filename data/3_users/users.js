const casual = require('casual');
const { ObjectId } = require('mongodb');

const circuits = require('../2_circuits/circuits');
const { accountHelpers } = require('../../helpers');

let users = [
  {
    firstName: 'Julian',
    lastName: 'Hernandez',
    email: 'julian@example.com',
    password: 'Julian1729$',
    refCode: 'jul1',
    circuitId: circuits[0].id, // attach to PA-16
    meta: {
      tokens: {},
      referredBy: null,
    },
    id: new ObjectId(),
  },
  {
    firstName: 'James',
    lastName: 'Jackson',
    email: 'james@example.com',
    password: 'JamesIsCool123',
    refCode: 'jam2',
    circuitId: circuits[1].id,
    meta: {
      tokens: {},
      referredBy: null,
    },
    id: new ObjectId(),
  },
];

casual.define('user', () => ({
  firstName: casual.first_name,
  lastName: casual.last_name,
  email: casual.email,
  password: casual.password,
  // use a hex code w/o # as refCode lol
  refCode: casual.rgb_hex.replace('#', ''),
  circuitId: null,
  meta: {
    tokens: {},
    // all random users will be referredBy Julian (first user)
    referredBy: users[0].id,
  },
  id: new ObjectId(),
}));

// enter 3 randomized users in to array
for (let i = 0; i < 3; i++) {
  users.push(casual.user);
}

// get available circuit ids but start at 2 index because first 2 were assigned
const availableCircuitIds = circuits.slice(2).map(({ id }) => id);
users.map(user => {
  // assign circuit from availble ids if does not already have one
  if (user.circuitId === null) {
    user.circuitId = availableCircuitIds.pop() || null;
  }
  // hash user passwords
  user.rawPassword = user.password;
  user.password = accountHelpers.hashPasswordSync(user.password);
  return user;
});

module.exports = users;
