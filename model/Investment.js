const mongoose = require('mongoose');

const InvestmentSchema = new mongoose.Schema({
  type: {
    type: Number,
    required:true,
  },
  name: {
    type: String,
    trim: true,
    required:true,
    },
    email:{
        type:String,
        required:true,
        
    },
    phone:{
    type:String,
    required:true
  },
    property:{
    type:String,
    required:true
  },
  image:{
    type:String,
    required:true
  },
  amount:{
    type:Number,
    required:true
  },
  isCompleted :{
    type: Boolean,
    default: false
 },
});

module.exports = mongoose.model('investement', InvestmentSchema);