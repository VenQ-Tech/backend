const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    trim: true,
  },
  phone: {
    type: String,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isVerified: {
    type: Number,
    default: 0,
  },
  pdfUploaded: {
    type: Boolean,
    default: false, // Default is false, indicating the PDF has not been uploaded yet
  },
  pdfLink: {
    type: String,
    default: "", // Default is an empty string, indicating no link yet
  },
});

module.exports = mongoose.model("Customer", customerSchema);
