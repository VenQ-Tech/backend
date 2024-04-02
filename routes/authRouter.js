const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')


router.post('/user/register', authController.signUp)
router.post('/user/verify', authController.verifyEmail)
router.post('/user/signout', authController.signOut)
router.post('/user/login', authController.login)
router.post('/user/resendOTP', authController.resendOTP)
router.get('/user/verifyAdmin',authController.verifyAdmin)
router.get('/user/checkLogin',authController.checkLogin)
router.get('/user/checkverify/:id',authController.checkverified);
router.post('/user/updateverify/:id',authController.updateverified);
router.get('/user/pendingkyc/all',authController.getpendingkyc);
router.get('/user/getallusers',authController.getallusers);
// router.get('user/read_users',authController.googlesheetmethod);
module.exports = router