var express = require('express');
var router = express.Router();
const { v4: uuidv4 } = require("uuid");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'THE DISCO' });
});

router.get('/disco', function(req, res, next) {
  res.render('disco')
});

router.get('/disco/:discoID', function(req, res, next) {
  res.render('disco');
});

module.exports = router;
