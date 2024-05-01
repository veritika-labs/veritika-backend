const express = require("express");
const router = express.Router();

const {
  signup,
  createWallet,
  retrieveUserWallets,
  retrieveWallets,
  fundWallet,
  retrieveTransactions,
  currentUser,
  walletToMpesa,
  walletToWallet,
} = require("../controllers/retailerController");
const {
  signin,
} = require("../controllers/clientController");
const validateToken = require("../middleware/validateToken");

router
  .post("/wallet/create", validateToken, createWallet)
  .post("/signup", signup)
  .post("/signin", signin)
  .get("/user", validateToken, currentUser)
  .get("/wallets", validateToken, retrieveUserWallets)
  .post("/wallet/fund", validateToken, fundWallet)
  .post("/wallet/mpesa", validateToken, walletToMpesa)
  .post("/wallet/wallet", validateToken, walletToWallet)
  .post("/transactions", validateToken, retrieveTransactions);

module.exports = router;
