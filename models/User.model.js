const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const shortid = require('shortid');
const bcrypt = require('bcrypt');

const { accountHelpers } = require('../helpers');

// remove "_" and "-" and use "$" and "@"
shortid.characters(
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@'
);

const userSchema = new Schema(
  {
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
    email: {
      type: String,
      required: true,
      unique: true,
      set: v => v.toLowerCase(),
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    circuitId: {
      type: mongoose.Types.ObjectId,
      unique: true,
    },
    refCode: {
      type: String,
      required: true,
      default: shortid.generate,
      unique: true,
    },
    meta: {
      type: Object,
      required: true,
      default: {
        tokens: {},
        referredBy: null,
      },
    },
  },
  { minimize: false }
);

// Virtuals
userSchema.virtual('name').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Statics
userSchema.static('findReferral', function(refCode) {
  return this.findOne({ refCode });
});

// Methods
userSchema.methods.validatePassword = function(rawPassword) {
  return bcrypt.compare(rawPassword, this.password);
};

// Middleware
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;

  // hash and set password
  const passwordHash = await accountHelpers.hashPassword(this.password);
  this.password = passwordHash;
});

module.exports = mongoose.model('User', userSchema);
