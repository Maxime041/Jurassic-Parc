const express = require('express');
const router = express.Router();
const Dinosaures = require('../Model/dinosaures');

// Get /api/dinosaures
router.get('/', async function (req, res, next) {
  try {
    const dinosaures = await Dinosaures.find();
    res.json({ result: true, dinosaures: dinosaures });
  } catch (error) {
    next(error);
  }
});

// Get /api/dinosaures/:id
router.get('/:id', async function (req, res, next) {
  try {
    const dinosaure = await Dinosaures.findOne({ id: req.params.id });
    if (dinosaure) {
      res.json({ result: true, dinosaure: dinosaure });
    } else {
      res.json({ result: false, error: "Dinosaure non trouvé" });
    }
  } catch (error) {
    next(error);
  }
});

// Post /api/dinosaures
router.post('/', async function (req, res, next) {
  try {
    const dinosaure = new Dinosaures({
      id: req.body.id,
      name: req.body.name,
      species: req.body.species,
      enclosure: req.body.enclosure,
      healthStatus: req.body.healthStatus || 'healthy',
      lastFedAt: req.body.lastFedAt || new Date(),
      dangerLevel: req.body.dangerLevel || 1
    });
    await dinosaure.save();
    res.json({ result: true, dinosaure: dinosaure });
  } catch (error) {
    next(error);
  }
});

// Put /api/dinosaures/:id
router.put('/:id', async function (req, res, next) {
  try {
    const updatedDinosaure = await Dinosaures.findOneAndUpdate(
      { id: req.params.id },
      {
        name: req.body.name,
        species: req.body.species,
        enclosure: req.body.enclosure,
        healthStatus: req.body.healthStatus,
        lastFedAt: req.body.lastFedAt,
        dangerLevel: req.body.dangerLevel
      },
      { new: true }
    );
    if (updatedDinosaure) {
      res.json({ result: true, message: "Dinosaure mis à jour !", dinosaure: updatedDinosaure });
    } else {
      res.json({ result: false, error: "Dinosaure non trouvé" });
    }
  } catch (error) {
    next(error);
  }
});

// Delete /api/dinosaures/:id
router.delete('/:id', async function (req, res, next) {
  try {
    const deletedDinosaure = await Dinosaures.findOneAndDelete({ id: req.params.id });
    if (deletedDinosaure) {
      res.json({ result: true, message: "Dinosaure supprimé !" });
    } else {
      res.json({ result: false, error: "Dinosaure non trouvé" });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
