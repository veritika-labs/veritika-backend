const express = require("express");
const router = express.Router();

const { createWallet } = require("../controllers/retailerController");

router.post("/create", createWallet);

module.exports = router;
