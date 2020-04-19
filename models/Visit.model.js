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
    congregationId: mongoose.Types.ObjectId,
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
  { minimize: false }
);

module.exports = mongoose.model('Visits', visitSchema);
