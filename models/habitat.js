const db = require('../db');

// habitat table contains (name, description)
// habitat_inhabitants (habitat, pokemon)

class Habitat {
  static async getAllHabitats() {
    let result = await db.query(`SELECT * FROM habitats`);
    return result.rows;
  }
  static async getSpecificHabitat(name) {
    // Needs to get all pokemon that live in the habitat too
    // Use a join on the search with the join table, full join
    let result = await db.query(`SELECT * FROM habitats WHERE name = $1`, [
      name
    ]);
    return result.rows[0];
  }

  // Need joins written
  static async getPokemonOfHabitats(name) {
    let result = await db.query(`SELECT * FROM `, [name]); // join, also include pokemon data in result
    return result.rows;
  }
  static async randomPokemonFromHabitat(name) {
    // JOIN ON THE JOIN TABLE AND THE POKEMON TABLE
    let habitatPokemon = await db.query(
      `SELECT * FROM pokemon ORDER BY random() LIMIT 1`,
      [name]
    );
    // Select a random item from the returned results. TO DO IN THE FUTURE - IMPLEMENT A WEIGHTING FOR APPEARANCE RATES
    let index = Math.floor(Math.random() * habitatPokemon.length);
    return habitatPokemon[index];
  }
}

module.exports = Habitat;
