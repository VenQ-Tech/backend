const express = require("express");
const app = express();
app.use(express.json());
// Body parsing middleware
const router = express.Router();
const mongoose = require("mongoose");

const Purchased = require("../model/Purchased");
// const customerController = require("../controllers/investmentController");
router.post("/:customerId", async (req, res) => {
  console.log(req, "req data");
  const customerId = req.params.customerId;
  const { propertyName, amount, quantity } = req.body;
  if (!mongoose.Types.ObjectId.isValid(customerId)) {
    return res.status(400).json({ error: "Invalid customerId" });
  }
  try {
    const newInvestment = new Purchased({
      customerId: customerId, // Assigning the customerId to the new investment
      propertyName: propertyName,
      amount: amount,
      quantity: quantity,
    });

    try {
      // Save the new investment to the database
      const savedInvestment = await newInvestment.save();
      res.status(201).json({
        message: "Investment added successfully",
        purchased: savedInvestment,
      });
    } catch (error) {
      console.error("Error saving investment to database:", error);
      res.status(500).json({ error: "Failed to save investment to database" });
    }
  } catch (error) {
    console.error("Error adding investment:", error);
    res.status(500).json({ error: "Failed to add investment" });
  }
});
router.get("/:customerId/getDetails", async (req, res) => {
  const customerId = req.params.customerId;

  if (!mongoose.Types.ObjectId.isValid(customerId)) {
    return res.status(400).json({ error: "Invalid customerId" });
  }

  try {
    // Find all investments for the specified customer
    const investments = await Purchased.find({ customerId: customerId });

    res.status(200).json({
      message: "Investments found successfully",
      purchased: investments,
    });
  } catch (error) {
    console.error("Error retrieving investments:", error);
    res.status(500).json({ error: "Failed to retrieve investments" });
  }
});

module.exports = router;
