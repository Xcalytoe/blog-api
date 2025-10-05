const paginate = async (model, query = {}, options = {}) => {
  const page = parseInt(options.page, 10) > 0 ? parseInt(options.page, 10) : 1;
  const limit =
    parseInt(options.limit, 10) > 0 ? parseInt(options.limit, 10) : 20;
  const skip = (page - 1) * limit;
  const sort = options.sort || { createdAt: -1 };
  const populate = options.populate || "";

  const total = await model.countDocuments(query);
  const totalPages = Math.ceil(total / limit);

  let docs = model.find(query).sort(sort).skip(skip).limit(limit);
  if (populate) docs = docs.populate(populate);
  const data = await docs.exec();

  return {
    total,
    page,
    limit,
    totalPages,
    data,
  };
};

module.exports = paginate;
