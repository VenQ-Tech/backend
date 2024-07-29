const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const connectDB = require("./config/dbConn");
const mongoose = require("mongoose");
const listingRoute = require("./routes/Listing");
const otplessRoute = require("./routes/otpless");
const investmentRoute = require("./routes/investmentRoute");
const phonepeRoute = require("./routes/phonepeRoute");
const surepassRoute = require("./routes/surepass");
const blogsRoute = require("./routes/blogs");
const mailRoute = require("./routes/mailRoute");

const purchasedRoute = require("./routes/purchasedRoute");
const kycRoute = require("./routes/kyc");
// const documentRoute = require("./routes/documentRouter");
const { OrderModel } = require("./model/Ordermodels");
// image haxdling--------------------------------
const bodyparser = require("body-parser");
const Razorpay = require("razorpay");
const imageDownloader = require("image-downloader");
const multer = require("multer");
const fs = require("fs");
const crypto = require("crypto");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const Purchased = require("./model/Purchased");
require("dotenv").config();
// -------------------------------
const PORT = process.env.PORT || 4000;
const app = express();

const razorpay = new Razorpay({
  key_id: "rzp_live_gHZIY3vAzSxfGR",
  key_secret: "78lMVpG9gwiuTOD4C9zLDYAV",
  // key_id: "rzp_test_qhajW6qJ3G4guZ",
  // key_secret: "DGr7QRTZVxpDZWTFP9HtJWCF",
});
console.log(process.env.NODE_ENV);
connectDB();
app.use(cors());

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads",
    allowed_formats: ["jpg", "jpeg", "png", "gif"],
  },
});

app.use(express.json());
app.use(cookieParser());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use("/otpless", otplessRoute);
app.use("/auth", require("./routes/authRouter"));
app.use("/phonepe", phonepeRoute);
app.use("/investment", investmentRoute);
app.use("/purchased", purchasedRoute);
app.use("/surepass", surepassRoute);
// app.use("/document", documentRoute);
app.use("/blogs", blogsRoute);
app.use("/sendmail", mailRoute);
app.use("/kyc", kycRoute);
app.use(express.static("public"));
app.use("/listing", listingRoute);

// Upload photo from device
const photosMiddleware = multer({ storage: storage }).array("photos", 100);

const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/docs"); //important this is a direct path fron our current file to storage location
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: fileStorageEngine });

//Photo Upload by link
app.post("/api/upload-by-link", async (req, res) => {
  const { link } = req.body;
  // console.log('below');
  console.log(link);
  try {
    const result = await cloudinary.uploader.upload(link, {
      folder: "upload",
      allowed_formats: ["jpg", "jpeg", "png", "gif"],
    });
    // console.log('heeere---');
    console.log(result);
    res.json(result.secure_url);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to upload image to Cloudinary" });
  }
});

app.post("/api/single", upload.single("file"), (req, res) => {
  // console.log(req.file.filename);
  res.status(201).json({
    dlink: req.file.filename,
  });
});

app.post("/api/upload", photosMiddleware, (req, res) => {
  console.log("upload image started");
  const uploadedFiles = [];
  for (let index = 0; index < req.files.length; index++) {
    uploadedFiles.push(req.files[index].path);
  }
  console.log("beforeuploading");
  console.log(uploadedFiles);
  res.json(uploadedFiles);
});

// file download routes
app.get("/download/:url", (req, res) => {
  const url = req.params.url;
  //path not fixed yet
  const path = `./public/documents/${url}`;
  res.download(path);
});
app.post("/payment/checkout", async (req, res) => {
  const { name, amount } = req.body;
  try {
    const order = await razorpay.orders.create({
      amount: Number(amount) * 100,
      currency: "INR",
    });

    await OrderModel.create({
      order_id: order.id,
      name: name,
      amount: amount,
    });

    console.log({ order });
    res.json({ order });
  } catch (error) {
    console.log(error);
  }
});

app.post("/payment/paymentVerification", async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
    req.body;

  const body_data = razorpay_order_id + "|" + razorpay_payment_id;
  try {
    const expect = crypto
      .createHmac("sha256", "78lMVpG9gwiuTOD4C9zLDYAV")
      .update(body_data)
      .digest("hex");

    const isValid = expect === razorpay_signature;
    if (isValid) {
      const existingOrder = await OrderModel.findOne({
        order_id: razorpay_order_id,
      });
      if (existingOrder) {
        // Update the existing order with payment details
        existingOrder.razorpay_payment_id = razorpay_payment_id;
        existingOrder.razorpay_order_id = razorpay_order_id;
        await existingOrder.save();

        // Return a success response
        console.log("payment successfulll");
        res.json({ success: true });
        return;
      }
    } else {
      res
        .status(400)
        .json({ success: false, message: "Payment verification failed" });
      return;
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

app.post("/payment/createTransfer", async (req, res) => {
  try {
    const { amount, paymentId, recipientAccountId, notes } = req.body;

    const transferOptions = {
      transfers: [
        {
          account: recipientAccountId,
          amount: Math.round(Number(amount) * 100), // Convert amount to paise
          currency: "INR",
          notes: {
            name: notes.name,
            propertyName: notes.propertyName,
          },
        },
      ],
    };

    const transfer = await razorpay.payments.transfer(
      paymentId,
      transferOptions
    );
    console.log("Transfer created successfully:", transfer);
    res.json({ transfer });
  } catch (error) {
    console.error("Error creating transfer:", error);
    res.status(500).json({ error: "Failed to create transfer" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
mongoose.connection.on("error", (err) => {
  console.log(err);
});
