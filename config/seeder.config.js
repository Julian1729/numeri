const path = require('path');
const { Seeder } = require('mongo-seeding');

// if (process.env.NODE_ENV === 'test') {
//   process.env.MONGODB_URI = 'mongodb://localhost:27017/NumeriTest';
// } else

if (!process.env.MONGODB_URI) {
  process.env.MONGODB_URI = 'mongodb://localhost:27017/NumeriLocal';
}

const config = {
  database: process.env.MONGODB_URI,
  dropDatabase: true,
};

const seeder = new Seeder(config);
const collections = seeder.readCollectionsFromPath(path.resolve('data'));

module.exports = () => seeder.import(collections);
