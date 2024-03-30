const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");

const signup = asyncHandler(async (req, res, next) => {
  const { first_name, last_name, phone_number, email, password } = req.body;

  if (!first_name || !last_name || !email || !password || !phone_number) {
    res.status(400);
    throw new Error("Please fill all the fields");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({
    first_name,
    last_name,
    email,
    phone_number,
    password: hashedPassword,
  });

  res
    .status(201)
    .json({ message: "User signed up successfully. Please sign in." });
});

const signin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide email and password");
  }

  const user = await User.findOne({ email });
  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const token = generateToken(user._id, user.first_name, user.last_name, user.email, user.role, user.phone_number);

  res.status(200).json({ token });
});

function generateToken(userId, first_name, last_name, email, role, phone_number) {
  const payload = {
    userId: userId,
    first_name: first_name,
    last_name: last_name,
    email: email,
    role: role,
    phone_number: phone_number,
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

  return token;
}

module.exports = {
  signup,
  signin,
};
