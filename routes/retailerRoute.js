const express = require("express");
const router = express.Router();

const {
  signup,
  createWallet,
  retrieveUserWallets,
  retrieveWallets,
  fundWallet,
  retrieveTransactions,
  checkInvoicestatus,
} = require("../controllers/retailerController");
const {
  signin,
} = require("../controllers/clientController");
const validateToken = require("../middleware/validateToken");

router
  .post("/wallet/create", validateToken, createWallet)
  .post("/signup", signup)
  .post("/signin", signin)
  .get("/wallets", validateToken, retrieveUserWallets)
  .get("/wallets/all", validateToken, retrieveWallets)
  .post("/wallet/fund", validateToken, fundWallet)
  .get("/transactions", retrieveTransactions)

module.exports = router;
