const pool = require('../db');

async function initDB() {
  const createTableSQL = `
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    uuid VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(255),
    email VARCHAR(255),
    city VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );`;

  await pool.query(createTableSQL);
}

async function insertUsers(users) {
  if (!users || users.length === 0) return { affectedRows: 0 };
  const values = users.map(u => [u.uuid, u.name, u.email, u.city]);
  const sql = `INSERT INTO users (uuid, name, email, city) VALUES ? ON DUPLICATE KEY UPDATE uuid = uuid`;
  const [res] = await pool.query(sql, [values]);
  return res;
}

async function countUsers(search) {
  if (search) {
    const q = `%${search}%`;
    const [rows] = await pool.query('SELECT COUNT(*) as c FROM users WHERE name LIKE ? OR email LIKE ? OR city LIKE ?', [q, q, q]);
    return rows[0].c;
  } else {
    const [rows] = await pool.query('SELECT COUNT(*) as c FROM users');
    return rows[0].c;
  }
}

async function getUsers({ page = 1, limit = 0, search = '' } = {}) {
  let sql = 'SELECT uuid, name, email, city FROM users';
  const params = [];
  if (search) {
    sql += ' WHERE name LIKE ? OR email LIKE ? OR city LIKE ?';
    const q = `%${search}%`;
    params.push(q, q, q);
  }
  sql += ' ORDER BY id ASC';
  if (limit && limit > 0) {
    const offset = (page - 1) * limit;
    sql += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);
  }
  const [rows] = await pool.query(sql, params);
  return rows;
}

async function updateUser(uuid, { name, email, city }) {
  const sql = 'UPDATE users SET name = ?, email = ?, city = ? WHERE uuid = ?';
  const [res] = await pool.query(sql, [name, email, city, uuid]);
  return res;
}

async function findUserByUuid(uuid){
  const [rows] = await pool.query('SELECT uuid, name, email, city FROM users WHERE uuid = ?', [uuid]);
  return rows[0];
}

module.exports = { initDB, insertUsers, getUsers, countUsers, updateUser, findUserByUuid };
