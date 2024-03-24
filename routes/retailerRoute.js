const express = require("express");
const router = express.Router();

const {
  createWallet,
  retrieveWallets,
  fundWallet,
  retrieveTransactions,
} = require("../controllers/retailerController");
const validateToken = require("../middleware/validateToken");

router
  .post("/create", validateToken, createWallet)
  .get("/wallets", retrieveWallets)
  .post("/fund", fundWallet)
  .get("/transactions", retrieveTransactions);

module.exports = router;
