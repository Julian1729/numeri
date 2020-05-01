const _ = require('lodash');
const casual = require('casual');
const { ObjectId } = require('mongodb');

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
  _id: new ObjectId(),
}));

let congregations = [
  {
    name: 'Roosevelt',
    _id: new ObjectId(),
  },
  {
    name: 'North English',
    _id: new ObjectId(),
  },
];

for (var i = 0; i < 100; i++) {
  congregations.push(casual.congregation);
}

module.exports = congregations;
