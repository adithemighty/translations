const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const locationSchema = Schema({
  city: String
});

const Location = mongoose.model("Location", locationSchema);
module.exports = Location;
