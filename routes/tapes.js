var express = require('express');
var router = express.Router();
var moment = require('moment');

var tapeController = require('../controllers/tapeController');

const TapeService = tapeController.TapeService;

router.get('/long', function(req, res, next) {
  TapeService.list()
    .then((tapes) => {
      console.log("tapes downloaded");
      res.render('tapes', {tapes: tapes});
    }).catch((err) => {
      res.render('error');
      res.end();
    });
});

router.get('/', function(req, res, next) {

  if (req.query.startDateTime) {
    console.log("help");
    start = moment(req.query.startDateTime).toDate();
    end = moment(req.query.endDateTime).toDate();
    console.log(start);
    TapeService.listrange(start, end)
    .then((tapes) => {
      console.log("tapes downloaded");
        res.render('shorttapes', {tapes: tapes});
      return;
    }).catch((err) => {
      res.render('error');
      res.end();
      return;
    });
  }

  else if (req.query.search_field) {
    console.log(req.query.search_field);
    TapeService.textsearch(req.query.search_field)
    .then((tapes) => {
      console.log("tapes downloaded");
      if (tapes.length == 0) {
        res.send("NO RESULTS");
        res.end();
        return;
      }
      res.render('shorttapes', {tapes: tapes});
      return;
    }).catch((err) => {
      res.render('error');
      res.end();
      return;
    });
  }

  else {
  TapeService.listall()
    .then((tapes) => {
      console.log("tapes downloaded");
      res.render('shorttapes', {tapes: tapes});
    }).catch((err) => {
      res.render('error');
      res.end();
    });
  }
});

// padzero if doesn't match
function padzero(item){
  item = ("000" + item).substr(-3,3);
  console.log(item);
  return item;
}

/* GET users listing. */
router.get('/:tape-:convo', function(req, res, next) {
  TapeService.read(padzero(req.params.tape) + "-" + padzero(req.params.convo))
      .then((tape) => {
            console.log(`tape downloaded`);
            if (tape === null) {
              console.log("nothing");
              res.render('error');
            }
            tape["startDateTimeMoment"] = moment(tape.startDateTime).format("LLLL");
            tape["endDateTimeMoment"] = moment(tape.endDateTime).format("LLLL");
            var re = /See Conversation No. (\d*-\d*)/g;
            tape["findingAid"] = tape["findingAid"].replace(re, '<a href="http://127.0.0.1:3000/tapes/$1">See Conversation No. $1</a>');
            res.render('tape', {tape: tape});
        }).catch((err) => {
            res.render('error');
            res.end();
        });
});

module.exports = router;
