const { ObjectId } = require('mongodb');

module.exports = [
  {
    name: 'PA-16',
    congregations: [new ObjectId(), new ObjectId(), new ObjectId()],
    meta: {
      previousOverseers: [],
    },
  },

  {
    name: 'NY-25',
    congregations: [new ObjectId(), new ObjectId(), new ObjectId()],
    meta: {
      previousOverseers: [new ObjectId(), new ObjectId()],
    },
  },

  {
    name: 'NY-13',
    congregations: [new ObjectId(), new ObjectId(), new ObjectId()],
    meta: {
      previousOverseers: [],
    },
  },

  {
    name: 'NJ-1',
    congregations: [new ObjectId(), new ObjectId(), new ObjectId()],
    meta: {
      previousOverseers: [],
    },
  },
];
