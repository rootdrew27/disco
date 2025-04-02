import express, { Router } from "express";
import { Request, Response, NextFunction } from "express";
import sqlite3 from "sqlite3";
import { Strategy as LocalStrategy } from "passport-local";
import { passport } from "../auth";
import crypto from "crypto";
import { db } from "../db";
import { signUp } from "../auth";

const router = Router();

router.get("/login", function (req, res, next) {
  res.render("login");
});

router.post(
  "/login/password",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureMessage: true,
  })
);

router.post("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

router.get("/signup", function (req, res, next) {
  res.render("signup");
});

// router.post("/signup", function (req, res, next) {
//   var salt = crypto.randomBytes(16);
//   crypto.pbkdf2(req.body.password, salt, 310000, 32, "sha256",
//     function (err, hashedPassword) {
//       if (err) {
//         return next(err);
//       }
//       db.run(
//         "INSERT INTO users (username, hashed_password, salt) VALUES (?, ?, ?)",
//         [req.body.username, hashedPassword, salt],
//         function (err) {
//           if (err) {
//             return next(err);
//           }
//           var user = {
//             id: this.lastID,
//             username: req.body.username,
//           };
//           req.login(user, function (err) {
//             if (err) {
//               return next(err);
//             }
//             res.redirect("/");
//           });
//         }
//       );
//     }
//   );
// });

router.post("/signup", function (req, res, next) {
  signUp(req.body.username, req.body.password, function (err: Error|null, user: Express.User) {
    if (err) return next(err);    
    req.login(user, function (err) {
      if (err) return next(err);
      res.redirect("/");
    });
  });
});

export default router;

// module.exports = router;
