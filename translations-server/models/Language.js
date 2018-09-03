const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const languageSchema = Schema({
  language: String
});

const Language = mongoose.model("Language", languageSchema);
module.exports = Language;
