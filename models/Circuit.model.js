const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const circuitSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      validate: {
        validator: /^\w{2}-\d+$/,
        message: props => `${props.value} is not a valid US Circuit`,
      },
      uppercase: true,
      trim: true,
      unique: true,
    },
    congregations: {
      type: [
        {
          type: mongoose.Types.ObjectId,
          ref: 'Congregation',
          unique: true,
        },
      ],
    },
    meta: {
      default: {
        previousOverseers: [],
      },
    },
  },
  { minimize: false }
);

circuitSchema.statics.findByName = function(name) {
  return this.findOne({ name });
};

module.exports = mongoose.model('Circuit', circuitSchema);
