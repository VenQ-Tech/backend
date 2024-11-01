// surepass.js (your route file)
const express = require("express");
const router = express.Router();
const surepassController = require("../controllers/surepassController");

router.post("/sendaadharotp", surepassController.sendaadharotp);
router.post("/checkaadharotp", surepassController.checkaadharotp);
router.post("/getpan", surepassController.getpandetails);
router.post("/initializeEsign", surepassController.initialiseesign);
router.post("/initializeEsignPROS", surepassController.initialiseesignPROS); // Ensure this is here
router.post("/uploadPdf", surepassController.uploadPdf);
router.get("/getsignedPdf/:client_id", surepassController.getSignedDocument);

module.exports = router;
