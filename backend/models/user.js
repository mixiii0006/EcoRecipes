const db = require('../config/database');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    reset_token TEXT,
    reset_token_expire INTEGER
  )`);
});

module.exports = db;