const mongoose = require("mongoose");

const testSchema = new mongoose.Schema({
  testQuestion: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId, ref: "TestQuestion" },
    },
  ],
});

module.exports = mongoose.model("Test", testSchema);
