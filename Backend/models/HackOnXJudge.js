const mongoose = require("mongoose");
const { Schema } = mongoose;

const innovvietJudgeSchema = new Schema({
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide a valid email",
    ],
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  role: {
    type: String,
    default: "HACKONXJudge",
    immutable: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const InnovvietJudge = mongoose.model("HACKONXJudge", innovvietJudgeSchema);

module.exports = InnovvietJudge;
