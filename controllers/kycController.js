const kycModel = require("../model/Kyc");
const addkyc = async (req, res) => {
  try {
    const result = await kycModel.create(req.body);
    if (result) {
      res.status(201).json({
        message: "successful",
      });
    } else {
      console.log("listing creation failed");
    }
  } catch (error) {
    console.log(error);
  }
};

const getkyc = async (req, res) => {
  try {
    const result = await kycModel.findOne({ email: req.params.id });
    if (result) {
      res.status(201).json({
        message: "successful",
        data: result,
      });
    } else {
      console.log("kyc find failed");
    }
  } catch (error) {
    console.log(error);
  }
};
const updateMailSentStatusByAadhaar = async (req, res) => {
  const { aadhaar_number } = req.body; // Assuming aadhaar_number is sent in the request body
  console.log("Received aadhaar_number:", aadhaar_number);

  try {
    const kyc = await kycModel.findOne({
      aadhaar_number,
    });
    if (!kyc) {
      console.log("No KYC record found for aadhaar_number:", aadhaar_number);
      return res.status(404).json({ error: "KYC record not found" });
    }

    console.log("KYC record found:", kyc);

    kyc.mailSent = true;
    await kyc.save();

    res.status(200).json({ message: "mailSent status updated successfully" });
  } catch (error) {
    console.error("Failed to update mailSent status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { addkyc, getkyc, updateMailSentStatusByAadhaar };
