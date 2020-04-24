const { ObjectId } = require('mongodb');

module.exports = [
  {
    firstName: 'Julian',
    lastName: 'Hernandez',
    email: 'email@example.com',
    password: 'ThisGoodPass123@',
    circuitId: new ObjectId(),
    refCode: '45xyz89',
  },

  {
    firstName: 'James',
    lastName: 'Jackson',
    email: 'james@example.com',
    password: 'JamesJackson123$',
    refCode: 'cvb784r',
  },
];
