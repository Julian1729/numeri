const casual = require('casual');
const { ObjectId } = require('mongodb');

const { accountHelpers } = require('../../helpers');

let users = [
  {
    firstName: 'Julian',
    lastName: 'Hernandez',
    email: 'julian@example.com',
    password: 'Julian1729$',
    refCode: 'jul1',
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
  meta: {
    tokens: {},
    // all random users will be referredBy Julian (first user)
    referredBy: users[0].id,
  },
  id: new ObjectId(),
}));

// enter 3 ranomized users in to array
for (let i = 0; i < 3; i++) {
  users.push(casual.user);
}

// hash user passwords
users.map(user => {
  user.rawPassword = user.password;
  user.password = accountHelpers.hashPasswordSync(user.password);
  return user;
});

module.exports = users;
