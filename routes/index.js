const express = require('express');

const router = express.Router();

const { name, version } = require('../package.json');

/* GET home page. */
router.get('/', function(req, res) {
  res.json({
    name,
    version,
  });
});

module.exports = router;
