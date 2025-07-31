const express = require('express');
const router = express.Router();
const Gardiens = require('../Model/Gardiens');

// GET /api/gardiens
router.get('/', async (req, res) => {
  try {
    const gardiens = await Gardiens.find();
    res.json(gardiens);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/gardiens/:id
router.get('/:id', async (req, res) => {
  try {
    const gardien = await Gardiens.findById(req.params.id);
    if (!gardien) {
      return res.status(404).json({ error: 'Gardien not found' });
    }
    res.json(gardien);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/gardiens
router.post('/', async (req, res) => {
  try {
    const gardien = new Gardiens(req.body);
    await gardien.save();
    res.status(201).json(gardien);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/gardiens/:id
router.put('/:id', async (req, res) => {
  try {
    const gardien = await Gardiens.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!gardien) {
      return res.status(404).json({ error: 'Gardien not found' });
    }
    res.json(gardien);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/gardiens/:id
router.delete('/:id', async (req, res) => {
  try {
    const gardien = await Gardiens.findByIdAndDelete(req.params.id);
    if (!gardien) {
      return res.status(404).json({ error: 'Gardien not found' });
    }
    res.json({ message: 'Gardien deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;