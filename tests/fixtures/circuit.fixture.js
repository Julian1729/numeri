const { ObjectId } = require('mongodb');

module.exports = [

  {
    name: 'PA-16',
    overseerId: new ObjectId(),
    meta: {
      previousOverseers: [],
    }
  },

  {
    name: 'NY-25',
    overseerId: null,
    meta: {
      previousOverseers: [new ObjectId(), new ObjectId()]
    }
  },

  {
    name: 'NY-13',
    overseerId: null,
    meta: {
      previousOverseers: [],
    }
  },

  {
    name: 'NJ-1',
    overseerId: new ObjectId(),
    meta: {
      previousOverseers: [],
    }
  }

];
