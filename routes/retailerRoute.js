const express = require("express");
const router = express.Router();

const {
  createWallet,
  retrieveWallets,
  fundWallet,
  retrieveTransactions,
} = require("../controllers/retailerController");

router
  .post("/create", createWallet)
  .get("/retrieve", retrieveWallets)
  .post("/fund", fundWallet)
  .get("/transactions", retrieveTransactions);

module.exports = router;
