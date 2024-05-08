const mongoose = require("mongoose");

const PurchasedSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer", // Reference to the Customer model
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
});

module.exports = mongoose.model("Purchased", PurchasedSchema);
