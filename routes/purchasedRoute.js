const express = require("express");
const app = express();
app.use(express.json());
// Body parsing middleware
const router = express.Router();
const mongoose = require("mongoose");
const Customer = require("../model/Customer");
const Purchased = require("../model/Purchased");
// const customerController = require("../controllers/investmentController");
router.post("/:customerId", async (req, res) => {
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

router.put("/update-status", async (req, res) => {
  const { id, statusType, status } = req.body;

  try {
    const purchased = await Purchased.findById(id);
    if (!purchased) {
      return res.status(404).json({ message: "Investor not found" });
    }
    
    purchased[statusType] = status;
    await purchased.save();
    res.status(200).json({ message: "Status updated successfully" });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ message: "Internal server error" });
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
router.get("/all", async (req, res) => {
  try {
    // Fetch purchased data
    const purchasedData = await Purchased.find().populate("customerId");
    res.json(purchasedData);
  } catch (error) {
    console.error("Error fetching purchased data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { surepassStatus, surepassProsStatus } = req.body;

  try {
    const updatedPurchase = await Purchased.findByIdAndUpdate(
      id,
      { surepassStatus, surepassProsStatus },
      { new: true }
    );
    res.status(200).json(updatedPurchase);
  } catch (error) {
    res.status(500).json({ message: "Error updating purchase status", error });
  }
});

module.exports = router;
