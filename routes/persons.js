var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Show all persons');
});

router.get('/:person', function(req, res, next) {
  res.send('Show data for this person');
});

module.exports = router;
