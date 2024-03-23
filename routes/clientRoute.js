const express = require("express");
const router = express.Router();

const { test, getClients } = require("../controllers/clientController");
const validateToken = require("../middleware/validateToken");

router.post("/test", validateToken, test).get("/get", getClients);


module.exports = router;