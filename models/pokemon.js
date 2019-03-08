const db = require('../db');

// pokemon table (id, name, species, title, flavor_text, catch_rate, sprite)
// habitat_inhabitants (habitat, pokemon)
class Pokemon {
  static async getPokemon(nameOrID, param = 'name') {
    if (param !== 'name') param = 'id';
    let query = `SELECT * FROM pokemon`;
    let values = [];
    if (nameOrID) {
      query = `${query} WHERE $1 = $2`;
      values = [param, nameOrID];
    }
    let result = await db.query(query, values);
    return result.rows[0] || result.rows;
  }
  static async getUniquePokemonNames() {
    let result = await db.query(`SELECT name FROM pokemon`);
    return new Set(result.rows.map(p => p.name));
  }
  // Needs a join written
  static async getHabitatsOfPokemon(name) {
    // Includes data on the specific pokemon
    let result = await db.query(`SELECT * FROM`, [name]); // Join table stuff
    return result.rows;
  }
}
module.exports = Pokemon;
