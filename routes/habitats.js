const express = require('express');
const router = new express.Router();
const Habitat = require('../models/habitat');
const PokeAPI = require('../models/pokemonHabitat');

// get all habitat data (excluding pokemon that live there)

router.get('/', async function(req, res, next) {
  try {
    let habitats = await Habitat.getAllHabitats();
    return res.json({ habitats });
  } catch (error) {
    return next(error);
  }
});

router.get('/everything', async function(req, res, next) {
  try {
    await PokeAPI.getAllHabitatsAndPokemon();
    return res.json({ true: true });
  } catch (error) {
    return next(error);
  }
});

router.get('/:habitat/battle', async function(req, res, next) {
  try {
    let pokemon = await Habitat.randomPokemonFromHabitat(req.params.habitat);
    return res.json({ pokemon });
  } catch (error) {
    return next(error);
  }
});

// get specific habitat data (including pokemon that live there)
router.get('/:habitat', async function(req, res, next) {
  try {
    let habitats = await Habitat.getSpecificHabitat(req.params.habitat);
    return res.json({ habitats });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
