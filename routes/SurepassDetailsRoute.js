const express = require('express');
const router = express.Router();
const { addSurepassDetails } = require('../controllers/SurepassDetailController'); // Adjust the path accordingly

// POST route to add Surepass details
router.post('/surepassDetails', addSurepassDetails);

module.exports = router;
