const mongoose = require('mongoose');

const GardiensSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  specialty: {
    type: String,
    enum: ['carnivores', 'herbivores', 'medical', 'security'],
    required: true
  },
  sector: {
    type: String,
    enum: ['A1', 'B2', 'C3', 'D4'],
    required: true
  },
  available: {
    type: Boolean,
    required: true
  },
  experience: {
    type: Number,
    min: 1,
    max: 10,
    required: true
  }
});

module.exports = mongoose.model('Gardiens', GardiensSchema);