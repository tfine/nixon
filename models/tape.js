var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Tape = mongoose.model("Tape", new Schema({
    conversationCode: String,
    tapeNumber: Number,
    conversationNumber: Number,
    startDateTime: Date,
    endDateTime: Date,
    description: String,
    findingAid: String,
    participants: String,
    recordingDevice: String,
    filename: [String],
    participantsList: [String],
    tapeStart: String,
    tapeEnd: String,
    nextCode: String,
    prevCode: String
  }), 'withfindaid');

module.exports = Tape;
