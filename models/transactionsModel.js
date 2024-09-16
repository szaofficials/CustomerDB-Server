// models/transactionsModel.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  customerId: {
    type: String,
    required: true,
  },
  datetime: {
    type: Date,
    required: true,
  },
  amountWithdrawn: {
    type: Number,
    required: true,
  },
  txnDoneBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  earnings: {
    type: Number,
    required: true,
  },
  bank: {
    type: String,
    required: true,
  },
  remark: {
    type: String,
    default: '',
  },
  txnApp: {
    type: String,
    required: true,
  },
  txnId: {
    type: String,
    required: true,
  },
  customerExists: {
    type: Boolean,
    default: false,
  },

}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Transaction', transactionSchema);
