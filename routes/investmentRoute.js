const express = require("express");
const router = express.Router();
const investmentController=require('../controllers/investmentController');
router.post("/add", investmentController.addinvestment);
router.post("/remove/:id", investmentController.removeCartItem);
router.get("/",investmentController.getAllInvestments);
router.get("/:id",investmentController.getCartItems);
module.exports = router;