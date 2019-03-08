const habitatDescriptions = {
  field: 'A grassy field dotted here and there with trees.',
  forest: 'Light barely reaches the bottom of this dense forest.',
  mountain:
    'A mountain range rises above, with a single beaten path ascending to the peak.',
  pond:
    'A series of ponds scattered here and there are all that marks the area.',
  sea: 'The sounds of the sea are waves occasionally lapping the beach.'
};

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
