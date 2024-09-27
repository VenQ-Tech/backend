const axios = require("axios");
const TOKEN_ID =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcxMDE2MzA0NiwianRpIjoiNzZiZTBhOTEtNmRjMy00MzYzLWI3N2QtZGE2MmY1NGFjYjBkIiwidHlwZSI6ImFjY2VzcyIsImlkZW50aXR5IjoiZGV2LnZlbnFAc3VyZXBhc3MuaW8iLCJuYmYiOjE3MTAxNjMwNDYsImV4cCI6MjAyNTUyMzA0NiwidXNlcl9jbGFpbXMiOnsic2NvcGVzIjpbInVzZXIiXX19.U7dHBU-d-MgfXi5pFeIkbwq5IZyrarKp-QSr0FBfytg";
const sendaadharotp = async (req, res) => {
  try {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.SUREPASS_TOKEN}`,
    };
    const result = await axios.post(
      "https://kyc-api.surepass.io/api/v1/aadhaar-v2/generate-otp",
      {
        id_number: req.body.aadharno,
      },
      {
        headers: headers,
      }
    );
    console.log("here---------------------");

    if (result) {
      console.log(result.data.data);
      res.status(200).send({
        success: true,
        data: result.data,
      });
    } else {
      console.log("invalid data");
      res.status(200).send({
        success: false,
        data: result.data,
      });
    }
  } catch (error) {
    console.log("error");
    console.log(error.message);
    res.status(500).send({
      success: false,
      error: error,
    });
  }
};
const getpandetails = async (req, res) => {
  try {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.SUREPASS_TOKEN}`,
    };
    const result = await axios.post(
      "https://kyc-api.surepass.io/api/v1/pan/pan-comprehensive",
      {
        id_number: req.body.panno,
      },
      {
        headers: headers,
      }
    );
    console.log("here---------------------");

    if (result) {
      console.log(result.data.data);
      res.status(200).send({
        success: true,
        data: result.data,
      });
    } else {
      console.log("invalid data");
      res.status(200).send({
        success: false,
        data: result.data,
      });
    }
  } catch (error) {
    console.log("error");
    console.log(error.message);
    res.status(500).send({
      success: false,
      error: error,
    });
  }
};

const checkaadharotp = async (req, res) => {
  try {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.SUREPASS_TOKEN}`,
    };
    const dts = {
      client_id: req.body.cid,
      otp: req.body.otp,
    };
    console.log(dts);
    const result = await axios.post(
      "https://kyc-api.surepass.io/api/v1/aadhaar-v2/submit-otp",
      dts,
      {
        headers: headers,
      }
    );
    console.log("here---------------------");

    if (result) {
      console.log(result.data.data);
      return res.status(200).send({
        success: true,
        data: result.data,
      });
    } else {
      console.log("invalid data");
      return res.status(200).send({
        success: false,
        data: result.data,
      });
    }
  } catch (error) {
    console.log("error");
    console.log(error.message);
    res.status(500).send({
      success: false,
      error: error,
    });
  }
};

const initialiseesign = async (req, res) => {
  try {
    const { name, phone, email } = req.body;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN_ID}`,
    };
    const pageWidth = 595;  // A4 width in points
    const pageHeight = 842; // A4 height in points

    // Calculate the position based on the percentage
    const xPosition = 0.2 * pageWidth; // 20% from the left
    const yPosition = 0.6 * pageHeight;
    const result = await axios.post(
      "https://kyc-api.surepass.io/api/v1/esign/initialize",
      {
        pdf_pre_uploaded: true,
        callback_url: "https://venq.in/",
        config: {
          auth_mode: 1,
          reason: "Contract",
        },
        prefill_options: {
          full_name: name,
          mobile_number: phone,
          user_email: email,
        },
        positions: {
          8: [ // Sign on the 8th page
            {
              x: xPosition,
              y: yPosition,
            },
          ],
        },
      },
      { headers: headers }
    );
    if (result) {
      console.log(result.data);
      res.status(200).send({
        success: true,
        data: result.data,
      });
    } else {
      console.log("gadbad");
      console.log(result.data);
      res.status(200).send({
        success: false,
        data: result.data,
      });
    }
  } catch (error) {
    console.log(error.response.data);
    res.status(500).send({
      success: false,
      error: error,
    });
  }
};
const uploadPdf = async (req, res) => {
  try {
    const { client_id, link } = req.body;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN_ID}`,
    };

    const data = JSON.stringify({
      client_id: client_id,
      link: link,
    });

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://kyc-api.surepass.io/api/v1/esign/upload-pdf",
      headers: headers,
      data: data,
    };

    const result = await axios(config);

    if (result) {
      console.log(result.data);
      res.status(200).send({
        success: true,
        data: result.data,
      });
    } else {
      console.log("Unexpected response");
      res.status(200).send({
        success: false,
        data: result.data,
      });
    }
  } catch (error) {
    console.log(error.response ? error.response.data : error);
    res.status(500).send({
      success: false,
      error: error.response ? error.response.data : error,
    });
  }
};
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
      {
        headers: headers,
      }
    );
    if (result) {
      console.log(result.data);
      res.status(200).send({
        success: true,
        data: result.data,
      });
    } else {
      console.log("invalid data");
      res.status(200).send({
        success: false,
        data: result.data,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error: error,
    });
  }
};

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

    console.log("Request Parameters:", req.params);
    console.log("Using Client ID:", client_id);

    const url = `https://kyc-api.surepass.io/api/v1/esign/get-signed-document/${encodeURIComponent(
      client_id
    )}`;

    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: url,
      headers: headers,
    };

    const result = await axios(config);

    console.log("API Response Status:", result.status);
    console.log("API Response Data:", result.data);

    if (result && result.data) {
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
      console.log("Unexpected response format or empty data");
      res.status(500).send({
        success: false,
        message: "Unexpected response format or empty data",
        data: result.data,
      });
    }
  } catch (error) {
    console.log(
      "Error Response:",
      error.response ? error.response.data : error.message
    );
    res.status(500).send({
      success: false,
      error: error.response ? error.response.data : error.message,
    });
  }
  // try {
  //   const { client_id } = req.params;
  //   const headers = {
  //     "Content-Type": "application/json",
  //     Authorization: `Bearer ${TOKEN_ID}`,
  //   };

  //   console.log("Request Parameters:", req.params);
  //   console.log("Using Client ID:", client_id);

  //   const config = {
  //     method: "get",
  //     maxBodyLength: Infinity,
  //     url: `https://kyc-api.surepass.io/api/v1/esign/get-signed-document/${encodeURIComponent(
  //       client_id
  //     )}`,
  //     headers: headers,
  //   };

  //   const result = await axios(config);

  //   console.log("API Response:", result.data);

  //   if (result && result.data) {
  //     res.status(200).send({
  //       success: true,
  //       data: result.data,
  //     });
  //   } else {
  //     console.log("Unexpected response");
  //     res.status(200).send({
  //       success: false,
  //       data: result.data,
  //     });
  //   }
  // } catch (error) {
  //   console.log(
  //     "Error Response:",
  //     error.response ? error.response.data : error
  //   );
  //   res.status(500).send({
  //     success: false,
  //     error: error.response ? error.response.data : error,
  //   });
  // }
};

module.exports = {
  sendaadharotp,
  checkaadharotp,
  initialiseesign,
  getUploadlink,
  getpandetails,
  uploadPdf,
  getSignedDocument,
};
