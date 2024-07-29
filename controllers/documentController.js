const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// Your Cloudinary credentials
const CLOUD_NAME = 'dwhhchqvk';
const API_KEY = '878584599835884';
const API_SECRET = 'I4BGPdD2N1RHok_-V847dq_unyM';

// Unsigned upload preset name
const UPLOAD_PRESET = 'q8wghijy'; // Replace with your actual unsigned upload preset name

exports.uploadPDF = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Ensure the file path is valid
        const filePath = path.resolve(req.file.path);
        if (!fs.existsSync(filePath)) {
            return res.status(400).json({ message: 'File not found' });
        }

        const form = new FormData();
        form.append('file', fs.createReadStream(filePath));
        form.append('resource_type', 'raw'); // Set resource_type to 'raw' for PDFs
        form.append('upload_preset', UPLOAD_PRESET); // Include your unsigned upload preset
        form.append('raw_convert','aspose')
        // Cloudinary upload endpoint with unsigned upload
        const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`;

        // Note: No need for authorization header with unsigned upload
        const response = await axios.post(url, form, {
            headers: {
                ...form.getHeaders(),
                // No Authorization header needed for unsigned upload
            }
        });

        // Clean up the file after upload
        fs.unlinkSync(filePath);

        res.json(response.data);
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error.response ? error.response.data : error.message);
        res.status(500).json({ message: 'Error uploading to Cloudinary', error: error.response ? error.response.data : error.message });
    }
};
