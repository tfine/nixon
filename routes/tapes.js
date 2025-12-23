var express = require('express');
var router = express.Router();
var moment = require('moment');

var tapeController = require('../controllers/tapeController');
const TapeService = tapeController.TapeService;

/* Utility */
function padzero(item) {
  return ("000" + item).slice(-3);
}

/* =========================
   LIST / SEARCH ROUTE
   ========================= */

router.get('/', function (req, res) {

  /* Text search */
  if (req.query.search_field) {
    return TapeService.textsearch(req.query.search_field)
      .then(tapes => {
        if (!tapes.length) {
          return res.render('page', { message: "No results." });
        }
        return res.render('shorttapes', {
          tapes,
          title: "Text Search"
        });
      })
      .catch(() => res.render('error'));
  }

  /* Participant search */
  if (req.query.name_field) {
    return TapeService.namesearch(req.query.name_field)
      .then(tapes => {
        if (!tapes.length) {
          return res.render('page', { message: "No results." });
        }
        return res.render('shorttapes', {
          tapes,
          title: req.query.name_field
        });
      })
      .catch(() => res.render('error'));
  }

  /* Default listing */
  return TapeService.listall()
    .then(tapes => {
      return res.render('shorttapes', {
        tapes,
        title: "All Tapes"
      });
    })
    .catch(() => res.render('error'));
});

/* =========================
   DETAIL ROUTE
   ========================= */

router.get('/:code', function (req, res) {

  const parts = req.params.code.split('-');
  if (parts.length !== 2) {
    return res.render('page', {
      message: "That page or conversation code do not exist!"
    });
  }

  const tape = padzero(parts[0]);
  const convo = padzero(parts[1]);
  const code = tape + "-" + convo;

  TapeService.read(code)
    .then(tapeDoc => {

      if (!tapeDoc) {
        return res.render('page', {
          message: "That page or conversation code do not exist!"
        });
      }

      tapeDoc.startDateTimeMoment =
        moment(tapeDoc.startDateTime).format("LLLL");

      tapeDoc.endDateTimeMoment =
        moment(tapeDoc.endDateTime).format("LLLL");

      if (tapeDoc.findingAid) {
        tapeDoc.findingAid = tapeDoc.findingAid
          .replace(
            /See Conversation No. (\d*-\d*)/g,
            '<a href="/tapes/$1">See Conversation No. $1</a>'
          )
          .replace(
            /See also Conversation No. (\d*-\d*)/g,
            '<a href="/tapes/$1">See also Conversation No. $1</a>'
          );
      }

      return res.render('tape', {
        tape: tapeDoc,
        title: tapeDoc.conversationCode
      });
    })
    .catch(() => res.render('error'));
});

module.exports = router;
