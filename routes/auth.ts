import express, { Router } from "express";
import { Request, Response, NextFunction } from "express";
import passport from "passport";
import crypto from "crypto";
import { db } from "../db";
import { signup } from "../auth";

export const router = Router();

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

router.post("/signup", function (req, res, next) {
  signup(req.body.username, req.body.password, function (err: Error|null, user: Express.User) {
    if (err) return next(err);
    req.login(user, function (err) {
      if (err) return next(err);
      res.redirect(400, "/");
    });
  });
});

// module.exports = router;
