const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const locationSchema = Schema({
  city: String,
  translators: [
    {
      type: Schema.Types.ObjectId,
      ref: "Translator"
    }
  ]
});

const Location = mongoose.model("Location", locationSchema);
module.exports = Location;
