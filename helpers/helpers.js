// INSERT INTO ${table} (<table columns>) VALUES ($1, $2, $3, etc), ($4, $5, $6)
// Generate this somehow using a helper function maybe

const habitatDescriptions = {};

function getDescription(habitatName) {
  if (habitatDescriptions[habitatName]) return habitatDescriptions[habitatName];
  return 'No data found for this location.';
}

/**
 *  Builds a query for inserting via SQL
 * @param {string} table
 * @param {array} columns items should be strings.
 * @param {array} items array of objects. Each object should contain the strings from columns.
 */
function buildMultipleInsert(table, columns, items) {
  let columnHeaders = columns.join(', ');
  let counter = 1;
  let entries = [];
  let values = [];
  for (let item of items) {
    let entry = [];
    for (let column of columns) {
      entry.push(`$${counter}`);
      values.push(item[column]);
      counter += 1;
    }
    entries.push(`(${entry.join(', ')})`);
  }
  let finalValues = entries.join(', ');

  let query = `INSERT INTO ${table} (${columnHeaders}) VALUES ${finalValues} RETURNING *`;
  return { query, values };
}

module.exports = { getDescription, buildMultipleInsert };
