import sqlite3 from 'sqlite3';
import mkdirp from 'mkdirp';
import crypto from 'crypto';

mkdirp.sync('./var/db');

export const db: sqlite3.Database = new sqlite3.Database(
  './var/db/sessions.db',
);

db.serialize(function () {
  db.run(
    'CREATE TABLE IF NOT EXISTS users ( \
    id INTEGER PRIMARY KEY, \
    username TEXT UNIQUE, \
    hashed_password BLOB, \
    salt BLOB \
  )',
  );

  // Create users table
  db.run('DELETE FROM users;');
  db.run('DELETE FROM sessions;');

  // create an initial user (username: alice, password: letmein)
  const salt: Buffer = crypto.randomBytes(16);
  db.run(
    'INSERT OR IGNORE INTO users (username, hashed_password, salt) VALUES (?, ?, ?)',
    [
      'testuser',
      crypto.pbkdf2Sync('password', salt, 310000, 32, 'sha256'),
      salt,
    ],
  );
});
