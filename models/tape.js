var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Tape = mongoose.model("Tape", new Schema({
    conversationCode: String,
    tapeNumber: String,
    conversationNumber: String,
    startDateTime: Date,
    endDateTime: Date,
    description: String,
    findingAid: String,
    participants: String,
    recordingDevice: String
  }), 'withfindaid');

module.exports = Tape;
