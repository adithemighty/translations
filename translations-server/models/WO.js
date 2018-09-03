const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Location = require("./Location");

const woSchema = Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  location: {
    locationId: { type: Schema.Types.ObjectId, ref: "Location" }
  },
  profileImageUrl: {
    type: String
  },
  idNumber: { type: String, required: true, unique: true }
});

woSchema.statics.getAllWithLocation = function getAllWithLocation() {
  return WO.find({}).populate("locationId");
};

const WO = mongoose.model("WO", woSchema);
module.exports = WO;
