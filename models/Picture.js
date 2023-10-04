const mongoose = require("mongoose");
const Picture = mongoose.model("original", {
  name: String,
  date: String,
  author: String,
  authorization: Boolean,
  camera: String,
  picture: Object,
});

module.exports = Picture;
