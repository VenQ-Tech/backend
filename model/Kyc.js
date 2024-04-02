const mongoose = require('mongoose');

const kycSchema = new mongoose.Schema({
    full_name: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    trim: true
  },
  phone:{
    type:String
  },
  aadhaar_number:{
    type:String
  },
  dob:{
    type:String
  },
  pan_number:{
    type:String
  },
  gender:{
    type:String
  },
  category:{
    type:String
  },
  bankName:{
    type:String
  },
  ac_type:{
    type:String
  },
  ac_no:{
    type:String
  },
  ifsc_code:{
    type:String
  }


});

module.exports = mongoose.model('KYC', kycSchema);
