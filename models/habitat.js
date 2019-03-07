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
  static async getPokemonofHabitats(name) {
    let result = await db.query(`SELECT * FROM `); // join
    return result.rows;
  }
}

module.exports = Habitat;
