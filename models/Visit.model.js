const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const meetingAttendanceSchema = new Schema({
  month: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  weeks: [[]],
});

const visitSchema = new Schema(
  {
    congregationId: {
      type: mongoose.Types.ObjectId,
      ref: 'Congregation',
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    importMethod: {
      type: Number,
      required: true,
    },
    meetingAttendance: {
      type: [meetingAttendanceSchema],
      required: true,
    },
    stats: {
      type: {},
      default: {
        averages: [],
        lists: [],
        totals: [],
      },
    },
  },
  {
    minimize: false,
    toObject: {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret._id;
        // add previousVisit to object
        if (doc.previousVisit) {
          ret.previousVisit = doc.previousVisit;
        }
        return ret;
      },
    },
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret._id;
        // add previousVisit to object
        if (doc.previousVisit) {
          ret.previousVisit = doc.previousVisit;
        }
        return ret;
      },
    },
  }
);

// Virtuals
visitSchema.virtual('congregation', {
  ref: 'Congregation',
  localField: 'congregationId',
  foreignField: '_id',
  justOne: true,
});

// OPTIMIZE: create virtual publishers and get publishers
// documents that belong to that visit

// Methods
visitSchema.methods.findPreviousVisit = function(fields = null) {
  return mongoose
    .model('Visit', visitSchema)
    .findOne(
      {
        congregationId: this.congregationId,
        endDate: { $lt: this.endDate },
      },
      fields
    )
    .sort({ endDate: -1 });
};

module.exports = mongoose.model('Visits', visitSchema);
