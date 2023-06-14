const mongoose = require("mongoose");

const testquestionSchema = new mongoose.Schema({
  question: {
    type: String,
  },
  option: [
    {
      ans: {
        type: String,
      },
    },
  ],
  correctOption: [
    {
      correct: {
        type: String,
      },
    },
  ],
  multipleAnswers: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Testquestion", testquestionSchema);
