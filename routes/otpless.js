const express = require("express");
const router = express.Router();
const OtpLessController = require("../controllers/otpless");
router.post("/login", OtpLessController.login);
router.post("/signup",OtpLessController.signup);
router.post('/otp/send', OtpLessController.sendOTP);
router.post('/otp/resend', OtpLessController.resendotp);
router.post('/otp/verify', OtpLessController.verifyOtp);
module.exports = router;