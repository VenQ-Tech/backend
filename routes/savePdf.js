const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const cloudinary = require("cloudinary").v2;

dotenv.config();

// Log the environment variables to ensure they are loaded correctly
console.log("CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY);
console.log("CLOUDINARY_API_SECRET:", process.env.CLOUDINARY_API_SECRET);

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.post("/", async (req, res) => {
  // Path to the existing "product_management.pdf" file
  const pdfPath = path.join(__dirname, "output", "product_management.pdf");

  console.log("PDF file path:", pdfPath);
  console.log("File exists:", fs.existsSync(pdfPath));

  if (!fs.existsSync(pdfPath)) {
    return res.status(404).json({ error: "PDF file not found" });
  }

  try {
    // Upload the existing PDF file to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(pdfPath, {
      resource_type: "raw", // Use 'raw' for non-image files like PDFs
      folder: "pdfs", // Optional: specify a folder in Cloudinary
    });

    console.log("PDF uploaded to Cloudinary", uploadResult);

    // Optionally, delete the local file after upload
    fs.unlink(pdfPath, (unlinkErr) => {
      if (unlinkErr) {
        console.log("Failed to delete local PDF", unlinkErr);
      } else {
        console.log("Local PDF deleted successfully");
      }
    });

    // Send the Cloudinary URL in the response
    res.status(200).json({
      message: "PDF uploaded to Cloudinary successfully",
      cloudinary_url: uploadResult.secure_url,
    });
  } catch (uploadErr) {
    console.log("Failed to upload PDF to Cloudinary", uploadErr);
    res.status(500).json({ error: "Failed to upload PDF to Cloudinary" });
  }
});

module.exports = router;
