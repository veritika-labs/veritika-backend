const asyncHandler = require("express-async-handler");
const Client = require("../models/clientSchema");

const test = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please fill all the fields");
  }

  const client = await Client.create({
    name,
    email,
    password,
  });

  res.status(201).json({
    client
  });
});

const getClients = asyncHandler(async (req, res, next) => {
  const client = await Client.find({});
  res.status(200).json({client:client});
});

module.exports = {
  test,
  getClients,
};
