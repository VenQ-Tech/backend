const express = require("express");
const router = express.Router();
const kycController = require("../controllers/kycController");
router.post("/add", kycController.addkyc);
router.get("/:id", kycController.getkyc);
router.post("/updateStatus", kycController.updateMailSentStatusByAadhaar);
module.exports = router;
