const express = require("express");
const router = express.Router();

const {
  signup,
  createWallet,
  retrieveUserWallets,
  retrieveWallets,
  fundWallet,
  retrieveTransactions,
} = require("../controllers/retailerController");
const {
  signin,
} = require("../controllers/clientController");
const validateToken = require("../middleware/validateToken");

router
  .post("/create", validateToken, createWallet)
  .post("/signup", signup)
  .post("/signin", signin)
  .get("/wallets", validateToken, retrieveUserWallets)
  .get("/wallets/all", validateToken, retrieveWallets)
  .post("/fund", fundWallet)
  .get("/transactions", retrieveTransactions);

module.exports = router;
