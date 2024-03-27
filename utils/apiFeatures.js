/* eslint-disable node/no-unsupported-features/es-syntax */
class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObject = { ...this.queryString };
    const excludeFields = ['sort', 'page', 'fields', 'limit'];
    excludeFields.forEach((el) => delete queryObject[el]);

    // Advance Filtering

    let queryString = JSON.stringify(queryObject);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`,
    ); // \b will find the exact word and g will do it multiple times without it will replace the first occurance
    // { duration: { '$lte': 5 }, difficulty: 'easy' }

    this.query.find(JSON.parse(queryString)); //build query

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');

      this.query = this.query.select(fields);
      // query = query.select('name duration price'); //Example
    } else {
      this.query = this.query.select('-__v'); //excluding __v
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1;

    const limit = this.queryString.limit * 1;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
