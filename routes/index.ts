import express, { Router } from "express";
import { Request, Response, NextFunction } from "express";
import passport from "passport";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import { ensureLoggedIn } from "connect-ensure-login";

// var express = require('express');
// var router = express.Router();
// var ensureLogIn = require('connect-ensure-login').ensureLoggedIn;
// var { v4: uuidv4 } = require("uuid");
// var passport = require("passport");

// var ensureLoggedIn = ensureLoggedIn();

export const router = Router();

/* GET home page. */
router.get('/', function(req: Request, res: Response, next: NextFunction) {
  if (!req.user){
    res.render("index");
  }
  else {
    res.render("index", { username: req.user.username });
  }
});

router.get('/disco', function(req: Request, res: Response, next: NextFunction) {
  res.render('disco');
});

router.get('/disco/:discoID', function(req: Request, res: Response, next: NextFunction) {
  res.render('disco');
});

// module.exports = ...
