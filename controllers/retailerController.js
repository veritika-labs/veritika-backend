const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const IntaSendService = require("../config/intasendService");
const intasendService = new IntaSendService(
  process.env.PUBLICKEY,
  process.env.PRIVATEKEY
);
const User = require("../models/userSchema");
const Wallet = require("../models/walletSchema");

const signup = asyncHandler(async (req, res, next) => {
  const { first_name, last_name, email, password, phone_number } = req.body;

  if (!first_name || !last_name || !email || !password || !phone_number) {
    res.status(400);
    throw new Error("Please fill in all the fields");
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    res.status(400);
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const role = "retailer";

  const user = await User.create({
    first_name,
    last_name,
    email,
    password: hashedPassword,
    phone_number,
    role,
  });

  if (!user) {
    res.status(500);
    throw new Error("Error creating user");
  }

  res
    .status(201)
    .json({ message: "User signed up successfully. Please sign in." });
});

const createWallet = asyncHandler(async (req, res, next) => {
  const { currency } = req.body;

  const email = req.user.email;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    const existingWallet = await Wallet.findOne({
      user_id: user._id,
      currency,
    });

    if (existingWallet) {
      res.status(400);
      throw new Error("User already has a wallet with this currency");
    }

    const walletResponse = await intasendService.createWallet({
      label: `${user.first_name} ${user.last_name} ${currency} Wallet`,
      currency: currency,
    });

    const newWallet = await Wallet.create({
      user_id: user._id,
      label: walletResponse.label,
      wallet_id: walletResponse.wallet_id,
      currency: currency,
      wallet_type: walletResponse.wallet_type,
      current_balance: walletResponse.current_balance,
      can_disburse: walletResponse.can_disburse,
      available_balance: walletResponse.available_balance,
    });

    res.status(201).json(newWallet);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const retrieveUserWallets = asyncHandler(async (req, res, next) => {
  const userId = req.user.userId;
  console.log(userId)
    const userWallets = await Wallet.find({ user_id: userId });

    if (!userWallets || userWallets.length === 0) {
      res.status(404);
      throw new Error("User has no wallets");
    }
    res.status(200).json({ userWallets });
});

const retrieveWallets = asyncHandler(async (req, res, next) => {
  try {
    const walletsList = await intasendService.retrieveWallets();
    res.status(200).json(walletsList);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving wallets" });
  }
});

const fundWallet = asyncHandler(async (req, res, next) => {
  const { amount, phoneNumber, walletId } =
    req.body;

    const { first_name, last_name, email} = req.user;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !amount ||
    !phoneNumber ||
    !walletId
  ) {
    res.status(400);
    throw new Error("Please fill all the fields");
  }

  const fundResponse = await intasendService.fundWallet({
    firstName: firstName,
    lastName: lastName,
    email: email,
    amount: amount,
    phoneNumber: phoneNumber,
    walletId: walletId,
  });

  sleep(20).then(() => {
    res.status(200).json(fundResponse);
  });
});

const retrieveTransactions = asyncHandler(async (req, res, next) => {
  const { walletId } = req.body; // Extract wallet ID from request parameters

  try {
    const transactions = await intasendService.retrieveTransactions(walletId);
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving transactions" });
  }
});

module.exports = {
  signup,
  createWallet,
  retrieveUserWallets,
  retrieveWallets,
  fundWallet,
  retrieveTransactions,
};
