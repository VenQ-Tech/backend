require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const connectDB = require('./config/dbConn');
const mongoose = require('mongoose');
const listingRoute = require('./routes/Listing');
const otplessRoute=require('./routes/otpless');
const investmentRoute=require('./routes/investmentRoute');
const phonepeRoute=require('./routes/phonepeRoute');
const surepassRoute=require('./routes/surepass');
const blogsRoute=require('./routes/blogs');
const kycRoute=require('./routes/kyc');
// image haxdling--------------------------------
const bodyparser=require('body-parser');
const imageDownloader = require("image-downloader");
const multer = require("multer");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// -------------------------------
const PORT = process.env.PORT || 4000;
const app = express();

console.log(process.env.NODE_ENV);
connectDB();
app.use(cors());


//cloudinary setup
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure:true
});
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
      folder: "uploads",
      allowed_formats: ["jpg", "jpeg", "png", "gif"],
  },
});



// app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use('/otpless',otplessRoute);
app.use('/auth', require('./routes/authRouter'));
app.use('/phonepe',phonepeRoute);
app.use('/investment',investmentRoute);
app.use('/surepass',surepassRoute);
app.use('/blogs',blogsRoute);
app.use('/kyc',kycRoute)
app.use(express.static('public'));
// Use the listingRoute for handling the '/listing' route
app.use('/listing', listingRoute);

// Upload photo from device
const photosMiddleware = multer({ storage: storage }).array("photos" , 100);

const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/docs"); //important this is a direct path fron our current file to storage location
  },
  filename: (req, file, cb) => {
    cb(null,file.originalname);
  },
});

const upload = multer({ storage: fileStorageEngine });

//Photo Upload by link
app.post("/api/upload-by-link", async (req, res) => {
  const { link } = req.body;
  // console.log('below');
  console.log(link);
  try{
      const result = await cloudinary.uploader.upload(link,{
        folder:"upload",
        allowed_formats:["jpg","jpeg","png","gif"]
      })
      // console.log('heeere---');
      console.log(result);
      res.json(result.secure_url)
  }catch(error){
      console.log(error);
      res.status(500).json({ error: "Failed to upload image to Cloudinary" });
  }
});

app.post("/api/single", upload.single("file"), (req, res) => {
  // console.log(req.file.filename);
  res.status(201).json({
    dlink:req.file.filename
  });
});

app.post("/api/upload", photosMiddleware, (req, res) => {
  console.log('upload image started');
  const uploadedFiles = [];
  for (let index = 0; index < req.files.length; index++) {
      uploadedFiles.push(req.files[index].path);
  }
  console.log('beforeuploading');
  console.log(uploadedFiles);
  res.json(uploadedFiles);
});

// file download routes 
app.get("/download/:url", (req, res) => {
  const url = req.params.url;
  //path not fixed yet
  const path = `./public/documents/${url}`;
  res.download(path)

})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

mongoose.connection.on('error', err => {
  console.log(err);
});
