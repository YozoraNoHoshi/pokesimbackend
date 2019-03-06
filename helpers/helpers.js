// INSERT INTO ${table} (<table columns>) VALUES ($1, $2, $3, etc), ($4, $5, $6)
// Generate this somehow using a helper function maybe

const habitatDescriptions = {};

function getDescription(habitatName) {
  if (habitatDescriptions[habitatName]) return habitatDescriptions[habitatName];
  return 'No data found for this location.';
}

module.exports = { getDescription };
