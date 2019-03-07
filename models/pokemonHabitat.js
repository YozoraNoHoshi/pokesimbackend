const db = require('../db');
const env = require('../config');
const axios = require('axios');
const Habitat = require('./habitat');
const Pokemon = require('./pokemon');
const { getDescription } = require('../helpers/helpers');

// pokemon table (id, name, species, title, flavor_text, catch_rate, sprite)
// habitat table (name, description)
// habitat_inhabitants (habitat, pokemon)
class PokeAPI {
  // Linking habitat to pokemon that live in habitat
  // Assume: Habitat exists. Pokemon may or may not exist.
  // Get a list of all pokemon in db
  // If pokemon in parameter is in the db list, add a join table entry to the selected habitat
  // Function does not need to return anything. I think.
  //
  // Get all pokemon that live inside a habitat
  // Join pokemon such that we get their data
  //
  // Get all habitats occupied by pokemon
  // Join habitats such that we get the data

  static async getAllHabitatsAndPokemon() {
    let response = await axios.get(`${env.POKEURL}/pal-park-area`);
    // habitats will look like [{name: forest, description: "No data found.", pokemon: [caterpie, butterfree, etc]}]
    let habitats = await Promise.all(
      response.rows.map(area => PokeAPI.getSpecificHabitat(area.name))
    );
  }

  static async getSpecificHabitat(areaName) {
    let response = await axios.get(`${env.POKEURL}/pal-park-area/${areaName}`);
    let name = response.data.name;
    let description = getDescription(response.data.name);
    let pokemon = response.data.pokemon_encounters.map(
      p => p.pokemon_species.name
    );
    return { name, description, pokemon };
  }

  static async getPokemon(pokemonName) {
    // We assume the habitat already exists in our local database.
    let response = await axios.get(
      `${env.POKEURL}/pokemon-species/${pokemonName}`
    );
    let {
      id,
      name,
      capture_rate,
      flavor_text_entries,
      genera,
      names,
      pal_park_encounters
    } = response.data;
    let sprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
    let title = genera.find(p => {
      return p.language.name === 'en';
    }).genus;
    let flavor_text = flavor_text_entries.find(p => {
      return p.version.name === 'emerald' && p.language.name === 'en';
    }).flavor_text;
    let species = names.find(p => {
      return p.language.name === 'en';
    }).name;
    let habitats = pal_park_encounters.map(p => {
      return p.area.name;
    });
    let pokemonData = {
      id,
      name,
      title,
      sprite,
      catch_rate: capture_rate,
      flavor_text,
      species
    };
    return await PokeAPI.insertPokemon(pokemonData);
  }

  static async insertHabitat(habitat) {
    // Inserts into habitats table
    let result = await db.query(
      `INSERT INTO habitats (name, description) VALUES ($1, $2) RETURNING *`,
      [habitat.name, habitat.description]
    );
    return result.rows[0];
  }

  static async insertPokemon({
    id,
    name,
    title,
    sprite,
    catch_rate,
    flavor_text,
    species
  }) {
    let result = db.query(
      `INSERT INTO pokemon (id, name, species, title, flavor_text, catch_rate, sprite) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [id, name, species, title, flavor_text, catch_rate, sprite]
    );
    return result.rows[0];
  }
}

// let pokemon = response.data.pokemon_encounters.map(p =>
//   Pokemon.getPokemonFromAPI(p.pokemon_species)
// );
// pokemon = await Promise.all(pokemon);
//

module.exports = PokeAPI;
