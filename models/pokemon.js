const db = require('../db');

// pokemon table (id, name, species, title, flavor_text, catch_rate, sprite)
// habitat_inhabitants (habitat, pokemon)
class Pokemon {
  static async getPokemon(nameOrID = '', param = 'name') {
    if (param !== 'name') param = 'id';
    let query = `SELECT * FROM pokemon`;
    let values = [];
    if (nameOrID) {
      query = `${query} WHERE ${param} = $1`;
      values = [nameOrID];
    }
    let result = await db.query(query, values);
    if (result.rows.length === 1) return result.rows[0];
    return result.rows;
  }
  static async getUniquePokemonNames() {
    let result = await db.query(`SELECT name FROM pokemon`);
    return new Set(result.rows.map(p => p.name));
  }
  static async getHabitatsOfPokemon(pokemonName) {
    let result = await db.query(
      `SELECT ph.habitat, p.id, p.name, p.species, p.title, p.flavor_text, p.catch_rate, p.sprite
    FROM pokehabitats ph
    JOIN pokemon p ON ph.pokemon = p.name
    WHERE ph.pokemon = $1;`,
      [pokemonName]
    );
    return result.rows;
  }
}
module.exports = Pokemon;
