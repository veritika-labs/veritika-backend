const express = require("express");
const router = express.Router();

const { test } = require("../controllers/clientController");

router.get("/test", test);