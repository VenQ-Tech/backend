const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: String,
    amount: Number,
    status: {
      type: String,
      enum: ['pending', 'approved', 'paid'],
      default: 'pending'
    },
    date: { type: Date, default: Date.now }
  });
  
  const Reward = mongoose.model('Reward', rewardSchema);