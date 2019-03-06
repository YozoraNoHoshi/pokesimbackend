const db = require('../db');
const env = require('../config');
const axios = require('axios');

class Pokemon {
  static async getPokemon() {
    let result = await db.query(`SELECT * FROM pokemon`);
    return result.rows;
  }
  static async getSpecificPokemon(name) {
    let result = await db.query(`SELECT * FROM pokemon WHERE name = $1`, [
      name
    ]);
    if (!result.rows[0]) result = await Pokemon.getPokemonFromAPI(name);
    return result;
  }

  static async getPokemonFromAPI(pokemonName) {
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
    // Pal park encounters for habitat data only really needs to return arrray of p.area.name
    // Genera needs to be .find for p.language.name === 'en' but return p.genus
    // flavor_text_entries .find for p.language.name === 'en' AND p.version.en === 'emerald' but return p.flavor_text
    let pokemonData = {
      id,
      name,
      title,
      sprite,
      catch_rate: capture_rate,
      flavor_text,
      species
    };
    return await Pokemon.insertPokemonToDB(pokemonData);
  }
  static async insertPokemonToDB({
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
module.exports = Pokemon;
