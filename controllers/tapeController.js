var Tape = require('../models/tape');

class TapeService {

    static list() {
        return Tape.find({}).sort({startDateTime: 1}).limit(20)
            .then((tapes) => {
                return tapes;
            });
    }

    static listrange(start, end) {
        console.log("help");
        return Tape.find({startDateTime: {
                            $gte: start,
                            $lte: end
                        }}).sort({startDateTime: 1}).limit(1000)
            .then((tapes) => {
                return tapes;
            });
    }

    static textsearch(text) {
        return Tape.find({$text: {$search: text}}).sort({startDateTime: 1}).limit(1000)
            .then((tapes) => {
                return tapes;
            });
    }

    static namesearch(name) {
        return Tape.find({participantsList: name}).sort({startDateTime: 1}).limit(1000)
            .then((tapes) => {
                return tapes;
            });
    }

    static listall(tapenum) {
        tapenum = parseInt(tapenum);
        return Tape.find({"tapeNumber": tapenum}).sort({startDateTime: 1}).limit(500)
            .then((tapes) => {
                return tapes;
            });
    }


    static read(code) {
        return Tape.findOne({"conversationCode" : code})
            .then((tape) => {
                return tape;
            });
    }

};

module.exports.TapeService = TapeService;
