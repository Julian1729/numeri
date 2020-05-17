const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const congregationSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret._id;
        return ret;
      },
    },
  }
);

module.exports = mongoose.model('Congregation', congregationSchema);
