
const pool = require('../database/connect.mysql.db');

class BookingInstance {
  constructor(data) {
    if (!data) return;
    Object.assign(this, data);
    this._id = data.id;
    this.booking_dates = data.booking_dates || [];
    if (data.user_id) this.booking_by = data.user_id;
  }

  async save() {
    const keys = Object.keys(this).filter((k) => k !== 'id' && k !== '_id' && k !== 'booking_dates' && k !== 'room_id' && k !== 'booking_by' && k !== 'reviews' && typeof this[k] !== 'function');
    if (this.booking_by) {
      this.user_id = this.booking_by;
      if (!keys.includes('user_id')) keys.push('user_id');
    }
    const setClause = keys.map((k) => `${k} = ?`).join(', ');
    const values = [...keys.map((k) => this[k]), this.id];
    await pool.query(`UPDATE bookings SET ${setClause} WHERE id = ?`, values);
    return this;
  }
}

const makeBookingQuery = (promise) => {
  promise.populate = function (field) {
    const nextPromise = (async () => {
      const booking = await promise;
      if (!booking) return null;

      const populateOne = async (b) => {
        if (field === 'room_id' || (typeof field === 'object' && field.path === 'room_id')) {
          const Room = require('./room.model');
          b.room_id = await Room.findById(b.room_id);
        }
        if (field === 'booking_by' || (typeof field === 'object' && field.path === 'booking_by')) {
          const User = require('./user.model');
          // Use user_id or booking_by for lookup
          const userId = b.user_id || b.booking_by;
          b.booking_by = await User.findById(userId);
        }
        if (field === 'reviews' || (typeof field === 'object' && field.path === 'reviews')) {
          const Review = require('./review.modal');
          const [rows] = await pool.query('SELECT id FROM reviews WHERE booking_id = ? LIMIT 1', [b.id]);
          if (rows.length) {
            b.reviews = await Review.findById(rows[0].id);
            if (typeof field === 'object' && field.populate && field.populate.path === 'user_id') {
              const User = require('./user.model');
              b.reviews.user_id = await User.findById(b.reviews.user_id);
            }
          }
        }
        return b;
      };

      if (Array.isArray(booking)) {
        return Promise.all(booking.map(populateOne));
      }
      return populateOne(booking);
    })();
    return makeBookingQuery(nextPromise);
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
    let dbKey = key;
    if (key === 'booking_by') dbKey = 'user_id';

    const val = query[key];
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      Object.keys(val).forEach((op) => {
        if (op === '$gt') {
          clauses.push(`${dbKey} > ?`);
          values.push(val[op] instanceof Date ? val[op] : new Date(val[op]));
        } else if (op === '$lt') {
          clauses.push(`${dbKey} < ?`);
          values.push(val[op] instanceof Date ? val[op] : new Date(val[op]));
        } else if (op === '$gte') {
          clauses.push(`${dbKey} >= ?`);
          values.push(val[op] instanceof Date ? val[op] : new Date(val[op]));
        } else if (op === '$lte') {
          clauses.push(`${dbKey} <= ?`);
          values.push(val[op] instanceof Date ? val[op] : new Date(val[op]));
        } else if (op === '$ne') {
          clauses.push(`${dbKey} != ?`);
          values.push(val[op]);
        }
      });
    } else {
      clauses.push(`${dbKey} = ?`);
      values.push(val);
    }
  });

  return {
    where: clauses.length > 0 ? ` WHERE ${clauses.join(' AND ')}` : '',
    values
  };
};

const Booking = {
  findById: (id) => makeBookingQuery((async () => {
    const [rows] = await pool.query('SELECT * FROM bookings WHERE id = ?', [id]);
    if (rows.length === 0) return null;
    const booking = rows[0];
    const [dates] = await pool.query('SELECT date FROM booking_dates WHERE booking_id = ?', [id]);
    booking.booking_dates = dates.map((d) => d.date);
    return new BookingInstance(booking);
  })()),

  findOne: (query) => makeBookingQuery((async () => {
    const { where, values } = buildWhereClause(query);
    const [rows] = await pool.query(`SELECT * FROM bookings${where} LIMIT 1`, values);
    if (rows.length === 0) return null;
    return Booking.findById(rows[0].id);
  })()),

  create: async (data) => {
    const { booking_dates, ...bookingData } = data;
    if (bookingData.booking_by) {
      bookingData.user_id = bookingData.booking_by;
      delete bookingData.booking_by;
    }
    const keys = Object.keys(bookingData);
    const placeholders = keys.map(() => '?').join(', ');
    const values = Object.values(bookingData);
    const [result] = await pool.query(`INSERT INTO bookings (${keys.join(', ')}) VALUES (${placeholders})`, values);
    const bookingId = result.insertId;
    if (booking_dates?.length) {
      const dateValues = booking_dates.map((d) => [bookingId, d]);
      await pool.query('INSERT INTO booking_dates (booking_id, date) VALUES ?', [dateValues]);
    }
    return Booking.findById(bookingId);
  },

  find: (query = {}) => makeBookingQuery((async () => {
    const { where, values } = buildWhereClause(query);
    const [rows] = await pool.query(`SELECT id FROM bookings${where}`, values);
    return Promise.all(rows.map((r) => Booking.findById(r.id)));
  })())
};

module.exports = Booking;
