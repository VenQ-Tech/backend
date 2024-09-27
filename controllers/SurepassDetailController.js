const SurepassDetails = require("../model/Surepassdetails"); // Adjust the path according to your project structure

// Controller to add Surepass details
const addSurepassDetails = async (req, res) => {
  try {
    const { clientId1, clientId2, pdfUrl, fatherName, phoneNumber, email } =
      req.body;

    // Find the existing record by email
    const existingRecord = await SurepassDetails.findOne({ email });

    if (existingRecord) {
      // Update the existing record with new data
      existingRecord.clientId1 = clientId1;
      existingRecord.clientId2 = clientId2;
      existingRecord.pdfUrl = pdfUrl;
      existingRecord.fatherName = fatherName;
      existingRecord.phoneNumber = phoneNumber;

      // Save the updated record
      await existingRecord.save();

      // Send a success response
      return res.status(200).json({
        success: true,
        message: "Surepass details updated successfully!",
        data: existingRecord,
      });
    } else {
      // Create a new instance of the SurepassDetails model
      const newSurepassDetails = new SurepassDetails({
        clientId1,
        clientId2,
        pdfUrl,
        fatherName,
        phoneNumber,
        email,
      });

      // Save the new record to the database
      await newSurepassDetails.save();

      // Send a success response
      return res.status(201).json({
        success: true,
        message: "Surepass details added successfully!",
        data: newSurepassDetails,
      });
    }
  } catch (error) {
    console.error("Error adding or updating Surepass details:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add or update Surepass details.",
      error: error.message,
    });
  }
};

module.exports = {
  addSurepassDetails,
};
