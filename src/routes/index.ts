import express, { Router } from "express";
import { Request, Response, NextFunction } from "express";
import passport from "passport";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import { ensureLoggedIn } from "connect-ensure-login";

// var ensureLoggedIn = ensureLoggedIn();

const router = Router();

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

export default router;
