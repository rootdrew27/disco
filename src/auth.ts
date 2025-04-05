import passport from 'passport';
import { IVerifyOptions, Strategy as LocalStrategy } from 'passport-local';
import crypto from 'crypto';
import { db } from './db';
import DiscoUser from './classes/DiscoUser';
import UserResult from './classes/database/UserResult';

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
          return done(null, false);
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
              return done(null, false);
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

export function signUp(username: string, password: string, cb: (err: Error | null, user?: DiscoUser) => void) {
    const salt = crypto.randomBytes(16);
    crypto.pbkdf2(
      password,
      salt,
      310000,
      32,
      'sha256',
      function (err: Error | null, hashedPassword: Buffer) {
        if (err) return cb(err);
        db.run(
          'INSERT INTO users (username, hashed_password, salt) VALUES (?, ?, ?)',
          [username, hashedPassword, salt],
          function (this: UserResult, err: Error | null) {
            if (err) return cb(err);
            const user = new DiscoUser(this.lastID, username);
            cb(err, user);
          }
        );
      },
    );
}

export { passport };
