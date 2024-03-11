const express = require("express");
const router = express.Router();

const { test, getClients } = require("../controllers/clientController");

router.post("/test", test).get("/get", getClients);


module.exports = router;