const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const documentController = require("../controllers/documentController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Directory where files are saved
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

router.post("/upload", upload.single("file"), documentController.uploadPDF);

module.exports = router;
