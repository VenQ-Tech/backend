const mongoose = require('mongoose');

const CheckboxDataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  selections: {
    esign1: { type: Boolean, default: false },
    esign2: { type: Boolean, default: false },
  },
}, { timestamps: true });

const CheckboxData = mongoose.model('CheckboxData', CheckboxDataSchema);
module.exports = CheckboxData;
