const { ObjectId } = require('mongodb');

module.exports = [
  {
    name: 'PA-16',
    meta: {
      previousOverseers: [],
    },
  },

  {
    name: 'NY-25',
    meta: {
      previousOverseers: [new ObjectId(), new ObjectId()],
    },
  },

  {
    name: 'NY-13',
    meta: {
      previousOverseers: [],
    },
  },

  {
    name: 'NJ-1',
    meta: {
      previousOverseers: [],
    },
  },
];
