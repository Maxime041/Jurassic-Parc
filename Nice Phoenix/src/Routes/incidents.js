const express = require('express');
const router = express.Router();
const Incidents = require('../model/incidents');

// Get /api/incidents
router.get('/', async function (req, res, next) {
  try {
    const incidents = await Incidents.find();
    res.json({ result: true, incidents: incidents });
  } catch (error) {
    next(error);
  }
});

// Get /api/incidents/:id
router.get('/:id', async function (req, res, next) {
  try {
    const incident = await Incidents.findById(req.params.id);
    if (incident) {
      res.json({ result: true, incident: incident });
    } else {
      res.json({ result: false, error: "Incident non trouvé" });
    }
  } catch (error) {
    next(error);
  }
});

// Post /api/incidents
router.post('/', async function (req, res, next) {
  try {
    const incident = new Incidents({
      type: req.body.type,
      severity: req.body.severity,
      location: req.body.location,
      assignedKeeper: req.body.assignedKeeper,
      status: req.body.status || 'open',
      createdAt: req.body.createdAt || new Date()
    });
    await incident.save();
    res.json({ result: true, incident: incident });
  } catch (error) {
    next(error);
  }
});

// Put /api/incidents/:id
router.put('/:id', async function (req, res, next) {
  try {
    const updatedIncident = await Incidents.findByIdAndUpdate(
      req.params.id,
      {
        type: req.body.type,
        severity: req.body.severity,
        location: req.body.location,
        assignedKeeper: req.body.assignedKeeper,
        status: req.body.status,
        createdAt: req.body.createdAt
      },
      { new: true }
    );
    if (updatedIncident) {
      res.json({ result: true, message: "Incident mis à jour !", incident: updatedIncident });
    } else {
      res.json({ result: false, error: "Incident non trouvé" });
    }
  } catch (error) {
    next(error);
  }
});

// Delete /api/incidents/:id
router.delete('/:id', async function (req, res, next) {
  try {
    const deletedIncident = await Incidents.findByIdAndDelete(req.params.id);
    if (deletedIncident) {
      res.json({ result: true, message: "Incident supprimé !" });
    } else {
      res.json({ result: false, error: "Incident non trouvé" });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
