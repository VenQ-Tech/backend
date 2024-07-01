const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  phone:{
    type:String,
    required:true,
    minlength:10
  },
  otp: {
    code: {
      type: String,
      required: true,
      minlength: 6
    },
    expiresAt: {
      type: Date,
      required: true
    }
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isLoggedIn: {
    type: Boolean,
    default: false
  },
  isAdmin :{
     type: Boolean,
     default: false
  }
});
module.exports = mongoose.model('user', userSchema);



// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   email: {
//     type: String,
//     unique: true,
//     required: true,
//     trim: true
//   },
//   password: {
//     type: String,
//     required: true,
//     minlength: 6
//   },
//   phone:{
//     type:String,
//     required:true,
//     minlength:10
//   },
//   otp: {
//     code: {
//       type: String,
//       required: true,
//       minlength: 6
//     },
//     expiresAt: {
//       type: Date,
//       required: true
//     }
//   },
//   isVerified: {
//     type: Boolean,
//     default: false
//   },
//   isLoggedIn: {
//     type: Boolean,
//     default: false
//   },
//   isAdmin :{
//      type: Boolean,
//      default: true
//   },
//   referralLink: {
//     type: String,
//     unique: true,
//     sparse: true
//   },
//   referralCount: {
//     type: Number,
//     default: 0
//   },
//   totalRewardsEarned: {
//     type: Number,
//     default: 0
//   }
// });

// module.exports = mongoose.model('user', userSchema);
