const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const circuitSchema = new Schema({
  name: {
    type: String,
    required: true,
    validator: v => {
      // validate for state-number format e.g. PA-16
      return /^\w{2}-\d+$/.test(v)
    },
    unique: true,
  },
  overseerId: mongoose.ObjectId,
  meta: {
    default: {
      previousOverseers: []
    }
  }
}, { minimize: false });

module.exports = mongoose.model('Circuit', circuitSchema);
