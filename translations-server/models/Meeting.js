const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const WO = require("./WO");
const Translator = require("./Translator");

const meetingSchema = Schema({
  status: {
    type: String,
    enum: ["confirmed", "passed", "cancelled", "waiting"]
  },
  date: Date,
  participants: Array,
  wo: { type: Schema.Types.ObjectId, ref: "WO", required: true },
  translator: { type: Schema.Types.ObjectId, ref: "Translator", required: true }
});

const Meeting = mongoose.model("Meeting", meetingSchema);
module.exports = Meeting;
