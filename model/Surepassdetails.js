const mongoose = require("mongoose");

// Define the schema for Surepass Details
const surepassDetailsSchema = new mongoose.Schema(
  {
    clientId1: {
      type: String,
      default: "", // Optional field, can be empty
    },
    clientId2: {
      type: String,
      default: "", // Optional field, can be empty
    },
    pdfUrl: {
      type: String,
      default: "", // This field will always be present but can be empty
    },
    fatherName: {
      type: String,
      required: true, // This field must be filled in
    },
    phoneNumber: {
      type: String,
      required: true, // Phone number field must be provided
    },
    email: {
      type: String,
      required: true, // Email must be provided
    },
  },
  { timestamps: true }
); // Automatically adds createdAt and updatedAt timestamps

// Create and export the Surepass Details model
const SurepassDetails = mongoose.model(
  "SurepassDetails",
  surepassDetailsSchema
);

module.exports = SurepassDetails;
