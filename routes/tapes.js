var express = require('express');
var router = express.Router();
var moment = require('moment');

var title = "";

var tapeController = require('../controllers/tapeController');

const TapeService = tapeController.TapeService;


// padzero if doesn't match
function padzero(item){
  item = ("000" + item).substr(-3,3);
  console.log(item);
  return item;
}


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

  else if (req.query.name_field) {
    console.log(req.query.name_field);
    TapeService.namesearch(req.query.name_field)
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

  else if (req.query.conversationnum) {
    tapenum = "/tapes/" + padzero(req.query.tapenum) + "-" + padzero(req.query.conversationnum)
    res.redirect(tapenum)
  }

  else {
  TapeService.listall(req.query.tapenum, req.query.conversationnum)
    .then((tapes) => {
      console.log("tapes downloaded");
      res.render('shorttapes', {tapes: tapes});
    }).catch((err) => {
      res.render('error');
      res.end();
    });
  }
});

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
            var realso = /See also Conversation No. (\d*-\d*)/g;
            tape["findingAid"] = tape["findingAid"].replace(re, '<a href="/tapes/$1">See Conversation No. $1</a>');
            tape["findingAid"] = tape["findingAid"].replace(realso, '<a href="/tapes/$1">See also Conversation No. $1</a>');
            res.render('tape', {tape: tape, title: tape["conversationCode"]});
        }).catch((err) => {
            res.render('error');
            res.end();
        });
});

module.exports = router;
