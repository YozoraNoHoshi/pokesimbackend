const db = require('../db');
const env = require('../config');
const axios = require('axios');
const { getDescription } = require('../helpers/helpers');

// habitat table contains (name, description)

class Habitat {
  static async getAllHabitats() {
    let result = await db.query(`SELECT * FROM habitats`);
    return result.rows;
  }
  static async getSpecificHabitat(name) {
    // Needs to get all pokemon that live in the habitat too
    // Use a join on the search with the join table, full join
    let response = await db.query(`SELECT * FROM habitats WHERE name = $1`, [
      name
    ]);
    let result = response.rows[0];
    if (!result) result = await Habitat.getSpecificFromAPI(name);
    return result;
  }
  static async getSpecificFromAPI(name) {
    let response = await axios.get(`${env.POKEURL}/pal-park-area/${name}`);
    let description = getDescription(response.data.name);
    // let pokemon = response.data.pokemon_encounters.map((p)=> p.pokemon_species)
    let habitat = {
      name: response.data.name,
      description
    };
    return await Habitat.insertHabitatToDB(habitat);
  }
  static async insertHabitatToDB(habitat) {
    // Inserts into habitats table
    return await db.query(
      `INSERT INTO habitats (name, description) VALUES ($1, $2) RETURNING *`,
      [habitat.name, habitat.description]
    );
  }
}

module.exports = Habitat;
