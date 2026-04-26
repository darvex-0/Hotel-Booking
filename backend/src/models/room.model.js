
const pool = require('../database/connect.mysql.db');

class RoomInstance {
  constructor(data) {
    if (!data) return;
    Object.assign(this, data);
    this._id = data.id;
    this.room_images = data.room_images || [];
    this.extra_facilities = data.extra_facilities || [];
  }

  async save() {
    const keys = Object.keys(this).filter((k) => k !== 'id' && k !== '_id' && k !== 'room_images' && k !== 'extra_facilities' && typeof this[k] !== 'function');
    if (this.room_slug) this.room_slug = this.room_slug.replace(/\s/g, '-');
    const setClause = keys.map((k) => `${k} = ?`).join(', ');
    const values = [...keys.map((k) => this[k]), this.id];
    await pool.query(`UPDATE rooms SET ${setClause} WHERE id = ?`, values);
    return this;
  }
}

const makeRoomQuery = (promise) => {
  promise.populate = function (field) {
    const nextPromise = (async () => {
      const room = await promise;
      if (!room) return null;
      const User = require('./user.model');

      const populateOne = async (r) => {
        if (field === 'created_by' && r.created_by) {
          r.created_by = await User.findById(r.created_by);
        }
        return r;
      };

      if (Array.isArray(room)) {
        return Promise.all(room.map(populateOne));
      }
      return populateOne(room);
    })();
    return makeRoomQuery(nextPromise);
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

const Room = {
  findById: (id) => makeRoomQuery((async () => {
    const [rows] = await pool.query('SELECT * FROM rooms WHERE id = ?', [id]);
    if (rows.length === 0) return null;
    const room = rows[0];
    const [images] = await pool.query('SELECT url FROM room_images WHERE room_id = ?', [id]);
    room.room_images = images.map((img) => ({ url: img.url }));
    const [facilities] = await pool.query('SELECT facility FROM room_facilities WHERE room_id = ?', [id]);
    room.extra_facilities = facilities.map((f) => f.facility);
    return new RoomInstance(room);
  })()),

  findOne: (query) => makeRoomQuery((async () => {
    const { where, values } = buildWhereClause(query);
    const [rows] = await pool.query(`SELECT * FROM rooms${where} LIMIT 1`, values);
    if (rows.length === 0) return null;
    return Room.findById(rows[0].id);
  })()),

  create: async (data) => {
    const { room_images, extra_facilities, ...roomData } = data;
    if (roomData.room_slug) roomData.room_slug = roomData.room_slug.replace(/\s/g, '-');
    const keys = Object.keys(roomData);
    const placeholders = keys.map(() => '?').join(', ');
    const values = Object.values(roomData);

    const [result] = await pool.query(`INSERT INTO rooms (${keys.join(', ')}) VALUES (${placeholders})`, values);
    const roomId = result.insertId;

    if (room_images?.length) {
      const imgValues = room_images.map((img) => [roomId, img.url]);
      await pool.query('INSERT INTO room_images (room_id, url) VALUES ?', [imgValues]);
    }
    if (extra_facilities?.length) {
      const facilityValues = extra_facilities.map((f) => [roomId, f]);
      await pool.query('INSERT INTO room_facilities (room_id, facility) VALUES ?', [facilityValues]);
    }
    return Room.findById(roomId);
  },

  findByIdAndUpdate: (id, data) => makeRoomQuery((async () => {
    const { room_images, extra_facilities, ...roomData } = data;
    if (Object.keys(roomData).length > 0) {
      const keys = Object.keys(roomData);
      const setClause = keys.map((k) => `${k} = ?`).join(', ');
      const values = [...Object.values(roomData), id];
      await pool.query(`UPDATE rooms SET ${setClause} WHERE id = ?`, values);
    }
    if (room_images) {
      await pool.query('DELETE FROM room_images WHERE room_id = ?', [id]);
      if (room_images.length) await pool.query('INSERT INTO room_images (room_id, url) VALUES ?', [room_images.map((img) => [id, img.url])]);
    }
    if (extra_facilities) {
      await pool.query('DELETE FROM room_facilities WHERE room_id = ?', [id]);
      if (extra_facilities.length) await pool.query('INSERT INTO room_facilities (room_id, facility) VALUES ?', [extra_facilities.map((f) => [id, f])]);
    }
    return Room.findById(id);
  })()),

  findByIdAndDelete: async (id) => {
    const room = await Room.findById(id);
    await pool.query('DELETE FROM rooms WHERE id = ?', [id]);
    return room;
  },

  find: (query = {}) => makeRoomQuery((async () => {
    const { where, values } = buildWhereClause(query);
    const [rows] = await pool.query(`SELECT id FROM rooms${where}`, values);
    return Promise.all(rows.map((r) => Room.findById(r.id)));
  })())
};

module.exports = Room;
