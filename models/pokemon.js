const db = require('../db');

// pokemon table (id, name, species, title, flavor_text, catch_rate, sprite)
// habitat_inhabitants (habitat, pokemon)
class Pokemon {
  static async getPokemon() {
    let result = await db.query(`SELECT * FROM pokemon`);
    return result.rows;
  }
  static async getUniquePokemonNames() {
    let result = await db.query(`SELECT name FROM pokemon`);
    return new Set(result.rows.map(p => p.name));
  }
  static async getSpecificPokemon(name) {
    let result = await db.query(`SELECT * FROM pokemon WHERE name = $1`, [
      name
    ]);
    return result.rows[0];
  }
  static async getHabitatsOfPokemon(name) {
    let result = await db.query(`SELECT * FROM`); // Join table stuff
    return result.rows;
  }
}
module.exports = Pokemon;
