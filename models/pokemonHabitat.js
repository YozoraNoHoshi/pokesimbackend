const db = require('../db');
const env = require('../config');
const axios = require('axios');
const Habitat = require('./habitat');
const Pokemon = require('./pokemon');
const { getDescription, buildMultipleInsert } = require('../helpers/helpers');

function uniquePokemon(habitats, seenPoke) {
  let pokemon = [];
  let tempPokemon = new Set(habitats.map(h => h.pokemon).flat());
  tempPokemon.forEach(p => pokemon.push(p));
  return pokemon.filter(p => !seenPoke.has(p));
}

function generateHabitatPairs(habitats) {
  let inhabitants = [];
  for (let habitat of habitats) {
    for (let poke of habitats.pokemon) {
      inhabitants.push({ habitat: habitat.name, pokemon: poke });
    }
  }
  return inhabitants;
}

// pokemon table (id, name, species, title, flavor_text, catch_rate, sprite)
// habitat table (name, description)
// habitat_inhabitants (habitat, pokemon)
class PokeAPI {
  static async getAllHabitatsAndPokemon() {
    let response = await Promise.all([
      axios.get(`${env.POKEURL}/pal-park-area`),
      Pokemon.getUniquePokemonNames()
    ]);
    let habitats = await Promise.all(
      response[0].data.results.map(area =>
        PokeAPI.getSpecificHabitat(area.name)
      )
    );
    let pokemon = uniquePokemon(habitats, response[1]);
    if (pokemon.length === 0) return;
    let pokemons = await Promise.all(pokemon.map(p => PokeAPI.getPokemon(p)));

    await Promise.all([
      PokeAPI.multipleInsert('habitats', ['name', 'description'], habitats),
      PokeAPI.multipleInsert(
        'pokemon',
        [
          'id',
          'name',
          'species',
          'title',
          'flavor_text',
          'catch_rate',
          'sprite'
        ],
        pokemons
      )
    ]);
    await PokeAPI.multipleInsert(
      'habitat_inhabitants',
      ['habitat', 'pokemon'],
      generateHabitatPairs(habitats)
    );
    return true;
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
      names
    } = response.data;
    let sprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
    let title = genera.find(p => {
      return p.language.name === 'en';
    }).genus;
    let flavor_text = flavor_text_entries.find(p => {
      return p.language.name === 'en';
    }).flavor_text;
    let species = names.find(p => {
      return p.language.name === 'en';
    }).name;
    return {
      id,
      name,
      title,
      sprite,
      catch_rate: capture_rate,
      flavor_text,
      species
    };
  }

  static async multipleInsert(table, columns, items) {
    let { query, values } = buildMultipleInsert(table, columns, items);
    let result = await db.query(query, values);
    return result.rows;
  }
}

// let pokemon = response.data.pokemon_encounters.map(p =>
//   Pokemon.getPokemonFromAPI(p.pokemon_species)
// );
// pokemon = await Promise.all(pokemon);
//

module.exports = PokeAPI;
