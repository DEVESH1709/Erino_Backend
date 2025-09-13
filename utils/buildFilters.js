// Utility to build filters for querying leads
// You can customize this function as needed

function buildFilters(query) {
  const filters = {};
  // Example: filter by status
  if (query.status) {
    filters.status = query.status;
  }
  // Add more filter logic as needed
  return filters;
}

module.exports = buildFilters;
