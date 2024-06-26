const mongoose = require("mongoose");

const referralSchema = new mongoose.Schema({
  referrerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  refereeId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: {
    type: String,
    enum: ["click", "signup", "investment"],
    default: "click",
  },
  rewardAmount: { type: Number, default: 0 },
});

const Referral = mongoose.model("Referral", referralSchema);
