const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "User id is required"],
      ref: "User",
    },
    wallet_id: {
      type: String,
      required: [true, "Wallet id is required"],
    },
    currency: {
      type: String,
      required: [true, "Currency is required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Wallet", walletSchema);
