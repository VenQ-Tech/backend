const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");

const CLOUD_NAME = "dwhhchqvk";
const UPLOAD_PRESET = "venq-main";

exports.uploadPDF = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = path.resolve(req.file.path);

    if (!fs.existsSync(filePath)) {
      return res.status(400).json({ message: "File not found" });
    }

    const form = new FormData();
    form.append("file", fs.createReadStream(filePath));
    form.append("resource_type", "image");
    form.append("upload_preset", UPLOAD_PRESET);

    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/raw/upload`;

    const response = await axios.post(url, form, {
      headers: {
        ...form.getHeaders(),
      },
    });

    fs.unlinkSync(filePath);

    res.json({ secure_url: response.data.secure_url });
  } catch (error) {
    console.error(
      "Error uploading to Cloudinary:",
      error.response ? error.response.data : error.message
    );
    res
      .status(500)
      .json({
        message: "Error uploading to Cloudinary",
        error: error.response ? error.response.data : error.message,
      });
  }
};
