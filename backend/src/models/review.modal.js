
const pool = require('../database/connect.mysql.db');

class ReviewInstance {
  constructor(data) {
    if (!data) return;
    Object.assign(this, data);
    this._id = data.id;
  }

  async save() {
    const keys = Object.keys(this).filter((k) => k !== 'id' && k !== '_id' && typeof this[k] !== 'function');
    const setClause = keys.map((k) => `${k} = ?`).join(', ');
    const values = [...keys.map((k) => this[k]), this.id];
    await pool.query(`UPDATE reviews SET ${setClause} WHERE id = ?`, values);
    return this;
  }
}

const makeReviewQuery = (promise) => {
  promise.populate = function (field) {
    const nextPromise = (async () => {
      const review = await promise;
      if (!review) return null;
      const User = require('./user.model');

      const populateOne = async (r) => {
        if (field === 'user_id' && r.user_id) {
          r.user_id = await User.findById(r.user_id);
        }
        return r;
      };

      if (Array.isArray(review)) {
        return Promise.all(review.map(populateOne));
      }
      return populateOne(review);
    })();
    return makeReviewQuery(nextPromise);
  };
  return promise;
};

const buildWhereClause = (query) => {
  const keys = Object.keys(query).filter((k) => k !== '_id');
  const values = [];
  const clauses = [];

  if (query._id) {
    clauses.push('id = ?');
    values.push(query._id);
  }

  keys.forEach((key) => {
    const val = query[key];
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      Object.keys(val).forEach((op) => {
        if (op === '$gt') {
          clauses.push(`${key} > ?`);
          values.push(val[op] instanceof Date ? val[op] : new Date(val[op]));
        } else if (op === '$lt') {
          clauses.push(`${key} < ?`);
          values.push(val[op] instanceof Date ? val[op] : new Date(val[op]));
        } else if (op === '$gte') {
          clauses.push(`${key} >= ?`);
          values.push(val[op] instanceof Date ? val[op] : new Date(val[op]));
        } else if (op === '$lte') {
          clauses.push(`${key} <= ?`);
          values.push(val[op] instanceof Date ? val[op] : new Date(val[op]));
        } else if (op === '$ne') {
          clauses.push(`${key} != ?`);
          values.push(val[op]);
        }
      });
    } else {
      clauses.push(`${key} = ?`);
      values.push(val);
    }
  });

  return {
    where: clauses.length > 0 ? ` WHERE ${clauses.join(' AND ')}` : '',
    values
  };
};

const Review = {
  findById: (id) => makeReviewQuery((async () => {
    const [rows] = await pool.query('SELECT * FROM reviews WHERE id = ?', [id]);
    return rows.length ? new ReviewInstance(rows[0]) : null;
  })()),

  findOne: (query) => makeReviewQuery((async () => {
    const { where, values } = buildWhereClause(query);
    const [rows] = await pool.query(`SELECT * FROM reviews${where} LIMIT 1`, values);
    return rows.length ? Review.findById(rows[0].id) : null;
  })()),

  create: async (data) => {
    const keys = Object.keys(data);
    const placeholders = keys.map(() => '?').join(', ');
    const values = Object.values(data);
    const [result] = await pool.query(`INSERT INTO reviews (${keys.join(', ')}) VALUES (${placeholders})`, values);
    return Review.findById(result.insertId);
  },

  findByIdAndUpdate: (id, data) => makeReviewQuery((async () => {
    const keys = Object.keys(data);
    const setClause = keys.map((k) => `${k} = ?`).join(', ');
    const values = [...Object.values(data), id];
    await pool.query(`UPDATE reviews SET ${setClause} WHERE id = ?`, values);
    return Review.findById(id);
  })()),

  findByIdAndDelete: async (id) => {
    const review = await Review.findById(id);
    await pool.query('DELETE FROM reviews WHERE id = ?', [id]);
    return review;
  },

  find: (query = {}) => makeReviewQuery((async () => {
    const { where, values } = buildWhereClause(query);
    const [rows] = await pool.query(`SELECT * FROM reviews${where}`, values);
    return rows.map((r) => new ReviewInstance(r));
  })()),

  countDocuments: async () => {
    const [[{ count }]] = await pool.query('SELECT COUNT(*) as count FROM reviews');
    return count;
  }
};

module.exports = Review;
