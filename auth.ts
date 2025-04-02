import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import crypto from "crypto";
import { db } from "./db";
import sqlite3 from "sqlite3";
import DiscoUser from "./classes/DiscoUser";

interface UserResult extends sqlite3.RunResult {
	username: string,
	hashed_password: Buffer,
	salt: crypto.BinaryLike
}

passport.use(
	new LocalStrategy(function verify(username: string, password: string, cb: Function) {
		db.get("SELECT * FROM users WHERE username = ?", [username], function (err, row: UserResult) {
			if (err) {
				return cb(err);
			}
			if (!row) {
				return cb(null, false, {
					message: "Incorrect Username or Password.",
				});
			}

			crypto.pbkdf2(
				password,
				row.salt,
				310000,
				32,
				"sha256",
				function (err, hashedPassword) {
					if (err) {
						return cb(err);
					}
					if (!crypto.timingSafeEqual(row.hashed_password, hashedPassword)) {
						return cb(null, false, {
							message: "Incorrect Username or Password."
						});
					}
					return cb(null, row);
				}
			);
		}
		);
	})
);

passport.serializeUser(function (user: Express.User, done) {
	process.nextTick(function () {
		done(null, { id: user.id });
	});
});

passport.deserializeUser(function (user: Express.User, done) {
	process.nextTick(function () {
		done(null, user);
	});
});


function hashPassword(password: string, cb: Function) {
	var salt = crypto.randomBytes(16);
	crypto.pbkdf2(password, salt, 310000, 32, "sha256", function (err: Error | null, hashedPassword: Buffer) {
		cb(err, hashedPassword, salt);
	});
}

function insertNewUser(username: string, hashedPassword: Buffer, salt: crypto.BinaryLike, cb: Function) {
	db.run(
		"INSERT INTO users (username, hashed_password, salt) VALUES (?, ?, ?)",
		[username, hashedPassword, salt],
		function (err: Error | null) {
			if (err) return cb(err);
			let user = new DiscoUser(this.lastID, username);
			cb(err, user);
		}
	);
}

export function signup(username: string, password: string, cb: Function) {
	hashPassword(password,
		function (err: Error | null, hashedPassword: Buffer, salt: crypto.BinaryLike) {
			if (err) return cb(err);
			insertNewUser(username, hashedPassword, salt, cb);
		}
	);
}

module.exports = signup;