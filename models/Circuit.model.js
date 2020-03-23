const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const circuitSchema = new Schema({
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
  overseerId: {
    type: mongoose.ObjectId,
    default: null,
    index: {
      unique: true,
      partialFilterExpression: {
        overseerId: {
          $type: 'objectId',
        }
      }
    }
  },
  meta: {
    default: {
      previousOverseers: []
    }
  }
}, { minimize: false });

// Instance Methods
circuitSchema.methods.releaseOverseer = function(){

  if(this.overseerId !== null){
    this.previousOverseers.push(currentOverseer);
  }
  this.overseerId = null;
  return this;

}

// Statics
// OPTIMIZE: this is kind of unnecessary because controllers
// use services to acces the model, this logic can be moved there
// but at the moment im to too lazy to moce logic and tests
circuitSchema.statics.findByOverseer = function(id) {

  return this.findOne({ overseerId: id });

}

circuitSchema.statics.findByName = function(name) {

  return this.findOne({ name });

}

module.exports = mongoose.model('Circuit', circuitSchema);
