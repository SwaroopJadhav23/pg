export function getPagination(query) {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

export async function paginate(modelQuery, countQuery, query) {
  const { page, limit, skip } = getPagination(query);
  const [items, total] = await Promise.all([
    modelQuery.skip(skip).limit(limit),
    countQuery
  ]);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      pages: Math.max(Math.ceil(total / limit), 1)
    }
  };
}

export function regexSearch(value) {
  return value ? new RegExp(String(value).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') : null;
}
