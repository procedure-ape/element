var express = require('express');
var router = express.Router();
// var multiparty = require('multiparty');
var util = require('util');
var fs = require('fs');

router.get('/', function (req, res, next) {
  //res.render('./views/index');
  res.sendfile('./views/index.html');
});

module.exports = router;