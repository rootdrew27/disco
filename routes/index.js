var express = require('express');
var router = express.Router();
var ensureLogIn = require('connect-ensure-login').ensureLoggedIn;
var { v4: uuidv4 } = require("uuid");

var ensureLoggedIn = ensureLogIn();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.user);
  if (!req.user){
    res.render("index");
  }
  else {
    res.render("index", { username: req.user.username });
  }
});

router.get('/disco', function(req, res, next) {
  res.render('disco');
});

router.get('/disco/:discoID', function(req, res, next) {
  res.render('disco');
});

module.exports = router;
