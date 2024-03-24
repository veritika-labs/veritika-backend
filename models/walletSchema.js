const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "User id is required"],
      ref: "User",
    },
    label: {
      type: String,
      required: [true, "Label is required"],
    },
    wallet_id:{
      type: String,
      required: [true, "Wallet id is required"],
    },
    can_disburse: {
      type: Boolean,
      required: [true, "Can disburse is required"],
    },
    currency: {
      type: Number,
      required: [true, "Currency is required"],
    },
    wallet_type: {
      type: String,
      required: [true, "Wallet type is required"],
    },
    current_balance: {
      type: Number,
      required: [true, "Current balance is required"],
    },
    available_balance: {
      type: Number,
      required: [true, "Available balance is required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Wallet", walletSchema);
