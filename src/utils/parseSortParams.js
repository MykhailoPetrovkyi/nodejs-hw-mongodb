const parseSortOrder = (sortOrder) => {
  if (typeof sortOrder === 'undefined') {
    return 'asc';
  }

  if (sortOrder !== 'asc' && sortOrder !== 'desc') {
    return 'asc';
  }
  return sortOrder;
};

const parseSortBy = (sortBy) => {
  if (typeof sortBy === 'undefined') {
    return 'name';
  }
  return sortBy;
};

export const parseSortParams = (query) => {
  const { sortOrder, sortBy } = query;

  const parsedSortOrder = parseSortOrder(sortOrder);
  const parsedSortBy = parseSortBy(sortBy);

  return { sortOrder: parsedSortOrder, sortBy: parsedSortBy };
};
