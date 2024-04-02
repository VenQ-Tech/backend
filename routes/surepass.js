const express = require("express");
const router = express.Router();
const surepassController=require('../controllers/surepassController');
router.post("/sendaadharotp", surepassController.sendaadharotp);
router.post("/checkaadharotp",surepassController.checkaadharotp);
router.post("/getpan",surepassController.getpandetails);
module.exports = router;