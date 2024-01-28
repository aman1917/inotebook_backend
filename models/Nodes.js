const mongoose = require("mongoose");

const NoteSchema = new Schema({
  title: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  tag: {
    type: String,
    default: "General",
  },
  date: {
    type: Date,
    require: Date.now,
  },
});

module.exports = mongoose.model("note", NoteSchema);
