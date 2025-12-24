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

  /* Date range search */
  if (req.query.startDateTime && req.query.endDateTime) {
    const start = moment(req.query.startDateTime, "MM/DD/YYYY").startOf('day');
    const end = moment(req.query.endDateTime, "MM/DD/YYYY").endOf('day');

    if (!start.isValid() || !end.isValid()) {
      return res.render('page', { message: "Please provide a valid date range." });
    }

    return TapeService.listrange(start.toDate(), end.toDate())
      .then(tapes => {
        if (!tapes.length) {
          return res.render('page', { message: "No results." });
        }
        return res.render('shorttapes', {
          tapes,
          title: `Date Range: ${req.query.startDateTime} - ${req.query.endDateTime}`
        });
      })
      .catch(() => res.render('error'));
  }

  /* Specific tape and/or conversation */
  if (req.query.tapenum || req.query.conversationnum) {
    if (!req.query.tapenum) {
      return res.render('page', { message: "Please provide a tape number." });
    }

    if (req.query.conversationnum) {
      const code = padzero(req.query.tapenum) + "-" + padzero(req.query.conversationnum);
      return res.redirect(`/tapes/${code}`);
    }

    return TapeService.listall(req.query.tapenum)
      .then(tapes => {
        if (!tapes.length) {
          return res.render('page', { message: "No results." });
        }
        return res.render('shorttapes', {
          tapes,
          title: "Tape " + padzero(req.query.tapenum)
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
