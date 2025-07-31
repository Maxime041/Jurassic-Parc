const mongoose = require('mongoose');

const parkMassenaSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  species: {
    type: String,
    required: true
  },
  enclosure: {
    type: String,
    required: true
  },
  healthStatus: {
    type: String,
    enum: ['healthy', 'sick', 'critical'],
    required: true
  },
  lastFedAt: {
    type: Date,
    required: true
  },
  dangerLevel: {
    type: Number,
    min: 1,
    max: 10,
    required: true
  }
});

module.exports = mongoose.model('ParkMassena', parkMassenaSchema);