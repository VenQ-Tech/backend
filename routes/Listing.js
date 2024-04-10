// Modify your server route handling '/listing' in routes/Listing.js

const express = require('express');
const router = express.Router();
const Listing = require('../model/Listing');
const {verifyAdmin,verifyUser}  = require('../middleware/verifyJWT') // Ensure that the path is correct based on your project structure


router.get('/', async (req, res) => {
  try {
    const listings = await Listing.find({ $or:[{islive:1},{islive:2},{islive:3}]}).sort({islive:1,_id:1});
    // console.log('Fetched listings:', listings); // Add this line to log the fetched listings
    res.json(listings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// router.get



// GET a particular listing by ID
router.get("/:id",async (req, res) => {
  try {
    const listingId = req.params.id;
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }
    // console.log("Fetched particular listing:", listing);
    // console.log(listing);
    res.json(listing);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error"});
}
});



// Route to create a new listing
router.post('/add',async (req, res) => {
  try {
    const {
      images,
      tourlink,
      properyheading,
      propertydescription,
      specs,
      propertyprice,
      annualizedreturn,
      annualappreciation,
      grossyield,
      netyield,
      propertyoverview,
      propertypricen,
      transactioncost,
      venqfee,
      projectedgrossrent,
      maintainencefee,
      servicecharges,
      annualnetincome,
      fundtimeline,
      locationlink,
      locationdescription,
      amenities,
      documents
    } = req.body;
        const result=await Listing.create({
          images,
  tourlink,
  properyheading,
  propertydescription,
  specs,
  propertyprice,
  annualizedreturn,
  annualappreciation,
  grossyield,
  netyield,
  propertyoverview,
  propertypricen,
  transactioncost,
  venqfee,
  projectedgrossrent,
  maintainencefee,
  servicecharges,
  annualnetincome,
  fundtimeline,
  locationlink,
  locationdescription,
  amenities,
  documents

        });
        if(result){
          res.status(201).json(result);
        }else{
          console.log('unable to add a new listing');
        }
  } catch (error) {
    console.log('ganda error')
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  });


// Update a particular listing by ID
router.patch('/:id', async (req, res) => {
  try {
    const listingId = req.params.id;
    
    // Check if the listing exists
    const existingListing = await Listing.findById(listingId);
    if (!existingListing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    // Update the existing listing with the new data
    const updatedListing = await Listing.findByIdAndUpdate(
      listingId,
      {$set:{islive:req.body.status}},
      { new: true } // This option ensures that the updated document is returned
    );

    // Check if the update was successful
    if (!updatedListing) {
      return res.status(500).json({ error: 'Internal Server Error during update' });
    }

    // Log the updated listing
    // console.log('Updated listing:', updatedListing);

    // Send the updated listing in the response
    res.json(updatedListing);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
