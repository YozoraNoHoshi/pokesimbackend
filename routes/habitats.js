const express = require('express');
const router = new express.Router();
const Habitat = require('../models/habitat');

// get all habitat data (excluding pokemon that live there)

router.get('/', async function(req, res, next) {
  let habitats = await Habitat.getAllHabitats();
  return res.json({ habitats });
});
// get specific habitat data (including pokemon that live there)
router.get('/:habitat', async function(req, res, next) {
  let habitats = await Habitat.getSpecificHabitat(req.params.habitat);
  return res.json({ habitats });
});

module.exports = router;
