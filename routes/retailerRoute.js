const express = require("express");
const router = express.Router();

const { createWallet, retrieveWallets } = require("../controllers/retailerController");

router.post("/create", createWallet).get("/retrieve", retrieveWallets);

module.exports = router;
