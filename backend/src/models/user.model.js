
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../database/connect.mysql.db');

class UserInstance {
  constructor(data) {
    if (!data) return;
    Object.assign(this, data);
    this._id = data.id; // Compatibility
    this.id = data.id;
  }

  getJWTToken() {
    return jwt.sign({ id: this.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES
    });
  }

  getJWTRefreshToken() {
    return jwt.sign({ id: this.id }, process.env.JWT_REFRESH_TOKEN_SECRET_KEY, {
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES
    });
  }

  async comparePassword(password) {
    return bcrypt.compare(password, this.password);
  }

  getResetPasswordToken() {
    const resetToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.resetPasswordExpire = new Date(Date.now() + 15 * 60 * 1000);
    return resetToken;
  }

  getEmailVerificationToken() {
    const verificationToken = crypto.randomBytes(20).toString('hex');
    this.emailVerificationToken = crypto.createHash('sha256').update(verificationToken).digest('hex');
    this.emailVerificationExpire = new Date(Date.now() + 15 * 60 * 1000);
    return verificationToken;
  }

  async save() {
    const keys = Object.keys(this).filter((k) => k !== 'id' && k !== '_id' && typeof this[k] !== 'function' && k !== 'select');

    if (this.password && this.password.length < 60) {
      this.password = await bcrypt.hash(this.password, 8);
    }

    const setClause = keys.map((k) => `${k} = ?`).join(', ');
    const values = [...keys.map((k) => this[k]), this.id];
    await pool.query(`UPDATE users SET ${setClause} WHERE id = ?`, values);
    return this;
  }
}

// Helper to make Query objects chainable
const makeQuery = (promise) => {
  promise.populate = function () { return this; }; // Basic no-op for now
  promise.select = function () { return this; };
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
      // Handle operators like $gt, $lt, $gte, $lte, $ne
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

const User = {
  findById: (id) => makeQuery((async () => {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows.length ? new UserInstance(rows[0]) : null;
  })()),

  findOne: (query) => makeQuery((async () => {
    const { where, values } = buildWhereClause(query);
    const [rows] = await pool.query(`SELECT * FROM users${where} LIMIT 1`, values);
    return rows.length ? new UserInstance(rows[0]) : null;
  })()),

  create: async (data) => {
    if (data.password) data.password = await bcrypt.hash(data.password, 8);
    if (data.userName) data.userName = data.userName.replace(/\s/g, '-');

    // Filter out undefined values to allow MySQL defaults to work
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== undefined)
    );

    const keys = Object.keys(filteredData);
    const placeholders = keys.map(() => '?').join(', ');
    const values = Object.values(filteredData);

    const [result] = await pool.query(`INSERT INTO users (${keys.join(', ')}) VALUES (${placeholders})`, values);
    return User.findById(result.insertId);
  },

  findByIdAndUpdate: (id, data) => makeQuery((async () => {
    if (data.password) data.password = await bcrypt.hash(data.password, 8);
    const keys = Object.keys(data);
    const setClause = keys.map((k) => `${k} = ?`).join(', ');
    const values = [...Object.values(data), id];
    await pool.query(`UPDATE users SET ${setClause} WHERE id = ?`, values);
    return User.findById(id);
  })()),

  findByIdAndDelete: async (id) => {
    const user = await User.findById(id);
    await pool.query('DELETE FROM users WHERE id = ?', [id]);
    return user;
  },

  find: (query = {}) => makeQuery((async () => {
    const { where, values } = buildWhereClause(query);
    const [rows] = await pool.query(`SELECT * FROM users${where}`, values);
    return rows.map((r) => new UserInstance(r));
  })()),

  countDocuments: async () => {
    const [[{ count }]] = await pool.query('SELECT COUNT(*) as count FROM users');
    return count;
  }
};

module.exports = User;
