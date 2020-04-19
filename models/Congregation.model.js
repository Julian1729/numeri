const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const congregationSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  circuitId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
});

module.exports = mongoose.model('Congregation', congregationSchema);
