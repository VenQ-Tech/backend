// const mongoose = require('mongoose')
// const customerSchema = new mongoose.Schema({
//   name: {
//     type: String,
//
//     trim: true
//   },
//   email: {
//     type: String,
//     unique: true,
//
//     trim: true
//   },
//   password: {
//     type: String,
//
//     minlength: 6
//   },
//   otp: {
//     type: String,
//
//     minlength: 6
//   },
//   isVerified: {
//     type: Boolean,
//     default: false
//   },
//   isLoggedIn: {
//     type: Boolean,
//     default: false
//   }

// })


// module.exports = mongoose.model('user', customerSchema);


const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: {
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
  isAdmin :{
    type: Boolean,
    default: false
 },
  isVerified :{
    type: Number,
    default: 0
 },

});

module.exports = mongoose.model('customer', customerSchema);
