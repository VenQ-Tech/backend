const cloudinary = require("cloudinary").v2;

console.log("Cloudinary Config:", {
  cloud_name: "dwhhchqvk",
  api_key: "878584599835884",
  api_secret: "I4BGPdD2N1RHok_-V847dq_unyM",
});
cloudinary.config({
  cloud_name: "dwhhchqvk",
  api_key: "878584599835884",
  api_secret: "I4BGPdD2N1RHok_-V847dq_unyM",
});

module.exports = cloudinary;
