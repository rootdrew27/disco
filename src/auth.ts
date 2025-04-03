import passport from 'passport';
import { IVerifyOptions, Strategy as LocalStrategy } from 'passport-local';
import crypto from 'crypto';
import { db } from './db';
import sqlite3 from 'sqlite3';
import DiscoUser from './classes/DiscoUser';

//  
interface UserResult extends sqlite3.RunResult {
  id: number;
  username: string;
  hashed_password: Buffer;
  salt: crypto.BinaryLike;
}

passport.use(
  new LocalStrategy(function verify(
    username: string,
    password: string,
    done: (error: Error|null, user?: Express.User | false, options?: IVerifyOptions) => void
  ) {
    db.get(
      'SELECT * FROM users WHERE username = ?',
      [username],
      function (err, row: UserResult) {
        if (err) {
          return done(err);
        }
        if (!row) {
          return done(null, false, {
            message: 'Incorrect Username or Password.',
          });
        }
        crypto.pbkdf2(
          password,
          row.salt,
          310000,
          32,
          'sha256',
          function (err, hashedPassword) {
            if (err) {
              return done(err);
            }
            if (!crypto.timingSafeEqual(row.hashed_password, hashedPassword)) {
              return done(null, false, {
                message: 'Incorrect Username or Password.',
              });
            }
            return done(null, row);
          },
        );
      },
    );
  }),
);

passport.serializeUser(function (user: Express.User, done) {
  process.nextTick(function () {
    done(null, { id: user.id, username: user.username });
  });
});

passport.deserializeUser(function (user: Express.User, done) {
  process.nextTick(function () {
    done(null, user);
  });
});

function hashPassword(password: crypto.BinaryLike, cb: (err: Error | null, hashedPassword: Buffer, salt: crypto.BinaryLike) => void) {
  const salt = crypto.randomBytes(16);
  crypto.pbkdf2(
    password,
    salt,
    310000,
    32,
    'sha256',
    function (err: Error | null, hashedPassword: Buffer) {
      cb(err, hashedPassword, salt);
    },
  );
}

function insertNewUser(
  username: string,
  hashedPassword: Buffer,
  salt: crypto.BinaryLike,
  cb: (err: Error | null, user?: DiscoUser) => void,
) {
  db.run(
    'INSERT INTO users (username, hashed_password, salt) VALUES (?, ?, ?)',
    [username, hashedPassword, salt],
    function (err: Error | null) {
      const user = new DiscoUser(this.lastID, username);
      if (err) return cb(err);
      cb(err, user);
    },
  );
}

export function signUp(username: string, password: string, cb: (err: Error | null, user?: DiscoUser) => void) {
  hashPassword(
    password,
    function (
      err: Error | null,
      hashedPassword: Buffer,
      salt: crypto.BinaryLike,
    ) {
      if (err) return cb(err);
      insertNewUser(username, hashedPassword, salt, cb);
    },
  );
}

export { passport };
