const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = require('mongodb');

const serviceReportsSchema = new Schema({
  month: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  minutes: {
    type: Number,
    required: true,
    default: 0,
  },
  placements: {
    type: Number,
    required: true,
    default: 0,
  },
  videos: {
    type: Number,
    required: true,
    default: 0,
  },
  returnVisits: {
    type: Number,
    required: true,
    default: 0,
  },
  studies: {
    type: Number,
    required: true,
    default: 0,
  },
});

const publisherSchema = new Schema(
  {
    publisherId: {
      type: mongoose.Types.ObjectId,
      ref: 'Publisher',
      required: true,
      default: new ObjectId(),
      unique: false,
    },
    visitId: {
      type: mongoose.Types.ObjectId,
      ref: 'Visit',
      required: true,
      unique: false,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ['male', 'female'],
    },
    appointment: {
      type: String,
      enum: ['elder', 'ms', null],
      default: null,
    },
    pioneerStatus: {
      type: String,
      enum: ['regular', 'aux', 'special', null],
      default: null,
    },
    baptized: {
      type: Boolean,
      default: false,
    },
    anointed: {
      type: Boolean,
      default: false,
    },
    status: Number,
    meta: {},
    serviceReports: [serviceReportsSchema],
  },
  { minimize: false }
);

// Set compund index for visitId and publisherId combination to be unique
publisherSchema.index({ publisherId: 1, visitId: 1 }, { unique: true });

// always assure that baptized is set to true if pioneer, appointed or anointed
publisherSchema.pre('save', function(next) {
  if (
    this.appointment !== '' ||
    this.pioneerStatus !== '' ||
    this.anointed !== ''
  ) {
    this.baptized = true;
  }
  next();
});

module.exports = mongoose.model('Publisher', publisherSchema);
