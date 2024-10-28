const axios = require("axios");
const TOKEN_ID = process.env.SUREPASS_TOKEN || "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcxMDE2MzA0NiwianRpIjoiNzZiZTBhOTEtNmRjMy00MzYzLWI3N2QtZGE2MmY1NGFjYjBkIiwidHlwZSI6ImFjY2VzcyIsImlkZW50aXR5IjoiZGV2LnZlbnFAc3VyZXBhc3MuaW8iLCJuYmYiOjE3MTAxNjMwNDYsImV4cCI6MjAyNTUyMzA0NiwidXNlcl9jbGFpbXMiOnsic2NvcGVzIjpbInVzZXIiXX19.U7dHBU-d-MgfXi5pFeIkbwq5IZyrarKp-QSr0FBfytg";

// Send Aadhaar OTP
const sendaadharotp = async (req, res) => {
  try {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN_ID}`,
    };
    const result = await axios.post(
      "https://kyc-api.surepass.io/api/v1/aadhaar-v2/generate-otp",
      {
        id_number: req.body.aadharno,
      },
      { headers }
    );

    if (result.data) {
      res.status(200).send({
        success: true,
        data: result.data,
      });
    } else {
      res.status(400).send({
        success: false,
        message: "Invalid data received",
      });
    }
  } catch (error) {
    console.error("Error in sendaadharotp:", error.message);
    res.status(500).send({
      success: false,
      error: error.response ? error.response.data : error.message,
    });
  }
};

// Get PAN details
const getpandetails = async (req, res) => {
  try {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN_ID}`,
    };
    const result = await axios.post(
      "https://kyc-api.surepass.io/api/v1/pan/pan-comprehensive",
      {
        id_number: req.body.panno,
      },
      { headers }
    );

    if (result.data) {
      res.status(200).send({
        success: true,
        data: result.data,
      });
    } else {
      res.status(400).send({
        success: false,
        message: "Invalid data received",
      });
    }
  } catch (error) {
    console.error("Error in getpandetails:", error.message);
    res.status(500).send({
      success: false,
      error: error.response ? error.response.data : error.message,
    });
  }
};

// Check Aadhaar OTP
const checkaadharotp = async (req, res) => {
  try {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN_ID}`,
    };
    const dts = {
      client_id: req.body.cid,
      otp: req.body.otp,
    };

    const result = await axios.post(
      "https://kyc-api.surepass.io/api/v1/aadhaar-v2/submit-otp",
      dts,
      { headers }
    );

    if (result.data) {
      res.status(200).send({
        success: true,
        data: result.data,
      });
    } else {
      res.status(400).send({
        success: false,
        message: "Invalid data received",
      });
    }
  } catch (error) {
    console.error("Error in checkaadharotp:", error.message);
    res.status(500).send({
      success: false,
      error: error.response ? error.response.data : error.message,
    });
  }
};

// Initialize e-signature
const initialiseesign = async (req, res) => {
  try {
    const { name, phone, email } = req.body;

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN_ID}`,
    };

    const raw = JSON.stringify({
      pdf_pre_uploaded: true,
      callback_url: "https://venq.in/",
      config: {
        auth_mode: 1,
        reason: "Contract",
        positions: {
          8: [{ x: 110, y: 440 }],
        },
      },
      prefill_options: {
        full_name: name,
        mobile_number: phone,
        user_email: email,
      },
    });

    const response = await axios.post(
      "https://kyc-api.surepass.io/api/v1/esign/initialize",
      raw,
      { headers }
    );

    if (response.status === 200) {
      res.status(200).send({
        success: true,
        data: response.data,
      });
    } else {
      res.status(400).send({
        success: false,
        message: "Failed to initialize e-sign",
        data: response.data,
      });
    }
  } catch (error) {
    console.error("Error in initialiseesign:", error.message);
    res.status(500).send({
      success: false,
      error: error.response ? error.response.data : error.message,
    });
  }
};

// Initialize e-signature for PROS
const initialiseesignPROS = async (req, res) => {
  try {
    const { name, phone, email } = req.body;

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN_ID}`,
    };

    const raw = JSON.stringify({
      pdf_pre_uploaded: true,
      callback_url: "https://venq.in/",
      config: {
        auth_mode: 1,
        reason: "Contract",
        positions: {
          2: [{ x: 350, y: 720 }],
          3: [{ x: 380, y: 70 }],
        },
      },
      prefill_options: {
        full_name: name,
        mobile_number: phone,
        user_email: email,
      },
    });

    const response = await axios.post(
      "https://kyc-api.surepass.io/api/v1/esign/initialize",
      raw,
      { headers }
    );

    if (response.status === 200) {
      res.status(200).send({
        success: true,
        data: response.data,
      });
    } else {
      res.status(400).send({
        success: false,
        message: "Failed to initialize e-sign for PROS",
        data: response.data,
      });
    }
  } catch (error) {
    console.error("Error in initialiseesignPROS:", error.message);
    res.status(500).send({
      success: false,
      error: error.response ? error.response.data : error.message,
    });
  }
};

// Upload PDF
const uploadPdf = async (req, res) => {
  try {
    const { client_id, link } = req.body;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN_ID}`,
    };

    const data = JSON.stringify({
      client_id,
      link,
    });

    const result = await axios.post(
      "https://kyc-api.surepass.io/api/v1/esign/upload-pdf",
      data,
      { headers }
    );

    if (result.data) {
      res.status(200).send({
        success: true,
        data: result.data,
      });
    } else {
      res.status(400).send({
        success: false,
        message: "Unexpected response format",
      });
    }
  } catch (error) {
    console.error("Error in uploadPdf:", error.message);
    res.status(500).send({
      success: false,
      error: error.response ? error.response.data : error.message,
    });
  }
};

// Get upload link
const getUploadlink = async (req, res) => {
  try {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN_ID}`,
    };
    const result = await axios.post(
      "https://kyc-api.surepass.io/api/v1/esign/get-upload-link",
      {
        client_id: req.body.clientid,
      },
      { headers }
    );

    if (result.data) {
      res.status(200).send({
        success: true,
        data: result.data,
      });
    } else {
      res.status(400).send({
        success: false,
        message: "Invalid data received",
      });
    }
  } catch (error) {
    console.error("Error in getUploadlink:", error.message);
    res.status(500).send({
      success: false,
      error: error.response ? error.response.data : error.message,
    });
  }
};

// Get signed document
const getSignedDocument = async (req, res) => {
  try {
    const { client_id } = req.params;

    if (!client_id) {
      return res.status(400).send({
        success: false,
        message: "Client ID is required",
      });
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN_ID}`,
    };

    const url = `https://kyc-api.surepass.io/api/v1/esign/get-signed-document/${encodeURIComponent(client_id)}`;

    const result = await axios.get(url, { headers });

    if (result.data) {
      if (result.data.status === "completed") {
        res.status(200).send({
          success: true,
          data: result.data,
        });
      } else {
        res.status(200).send({
          success: true,
          message: "Signing process is not completed yet.",
          data: result.data,
        });
      }
    } else {
      res.status(400).send({
        success: false,
        message: "Invalid data received",
      });
    }
  } catch (error) {
    console.error("Error in getSignedDocument:", error.message);
    res.status(500).send({
      success: false,
      error: error.response ? error.response.data : error.message,
    });
  }
};

module.exports = {
  sendaadharotp,
  getpandetails,
  checkaadharotp,
  initialiseesign,
  initialiseesignPROS,
  uploadPdf,
  getUploadlink,
  getSignedDocument,
};
