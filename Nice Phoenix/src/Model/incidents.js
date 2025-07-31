const mongoose = require('mongoose');

const IncidentsSchema = new mongoose.Schema({

  type: {
    type: String,
    enum: ['escape', 'malfunction', 'medical'],
    required: true
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    required: true
  },
  location: {
    type: String,
    required: true
  },
  assignedKeeper: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'resolved'],
    required: true
  },
  createdAt: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model('Incidents', IncidentsSchema);
