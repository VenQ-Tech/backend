const mongoose = require("mongoose");

const PurchasedSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
  },
  propertyName: {
    type: String,
    trim: true,
  },
  amount: {
    type: Number,
  },
  quantity: {
    type: Number,
  },
  surepassStatus: {
    type: String,
    enum: ["Completed", "Not Completed"],
    default: "Not Completed",
  },
  surepassProsStatus: {
    type: String,
    enum: ["Completed", "Not Completed"],
    default: "Not Completed",
  },
});

module.exports = mongoose.model("Purchased", PurchasedSchema);
