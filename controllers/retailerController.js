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
      label: `${user.first_name}  ${user._id} ${currency} Wallet`,
      currency: currency,
    });

    const newWallet = await Wallet.create({
      user_id: user._id,
      wallet_id: walletResponse.wallet_id,
      currency: currency,
    });

    res.status(201).json(walletResponse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const retrieveUserWallets = asyncHandler(async (req, res, next) => {
  const userId = req.user.userId;
  const userWallets = await Wallet.find({ user_id: userId });

  if (!userWallets || userWallets.length === 0) {
    res.status(404);
    throw new Error("User has no wallets");
  }

  const walletIds = userWallets.map((wallet) => wallet.wallet_id);
  const walletsList = await intasendService.retrieveWallets();

  const userWalletDetails = [];
  walletIds.forEach((walletId) => {
    const walletDetail = walletsList.results.find(
      (wallet) => wallet.wallet_id === walletId
    );
    if (walletDetail) {
      userWalletDetails.push(walletDetail);
    }
  });

  if (userWalletDetails.length === 0) {
    res.status(404);
    throw new Error("Could not find details of the user's wallets");
  }

  res.status(200).json({ userWalletDetails });
});

const fundWallet = asyncHandler(async (req, res, next) => {
  const { amount, phoneNumber, walletId } = req.body;
  const { first_name, last_name, email } = req.user;

  if (
    !first_name ||
    !last_name ||
    !email ||
    !amount ||
    !phoneNumber ||
    !walletId
  ) {
    res.status(400).json({ message: "Please fill all the fields" });
  }

  try {
    const fundResponse = await intasendService.mpesaToWallet({
      firstName: first_name,
      lastName: last_name,
      email: email,
      amount: amount,
      phoneNumber: phoneNumber,
      walletId: walletId,
    });

    const invoiceId = fundResponse.invoice.invoice_id;

    const timeout = 50 * 1000;
    const startTime = Date.now();

    const checkStatus = async () => {
      const response = await intasendService.checkPaymentStatus(invoiceId);
      const status = response.invoice.state;

      console.log("Status: ", status);

      if (status !== "PENDING" && status !== "PROCESSING") {
        if (status === "COMPLETE") {
          const walletsList = await intasendService.retrieveWallets();
          const targetWallet = walletsList.results.find(
            (wallet) => wallet.wallet_id === walletId
          );

          if (targetWallet) {
            const walletToUpdate = await Wallet.findOne({
              wallet_id: walletId,
            });

            if (!walletToUpdate) {
              throw new Error("Wallet not found in database");
            }

            walletToUpdate.current_balance = parseFloat(
              targetWallet.current_balance
            );
            walletToUpdate.available_balance = parseFloat(
              targetWallet.available_balance
            );

            await walletToUpdate.save();
            res.status(200).json({ message: "Transaction successful" });
          }
        }
        if (status === "FAILED") {
          res.status(500).json({ error: "Transaction failed" });
        }
      } else {
        if (Date.now() - startTime < timeout) {
          setTimeout(checkStatus, 1000);
        } else {
          res.status(500).json({ error: "Transaction timed out" });
        }
      }
    };

    await checkStatus();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const retrieveTransactions = asyncHandler(async (req, res, next) => {
  const { currency } = req.body;
  const email = req.user.email;
  if (!currency) {
    res.status(400);
    throw new Error("Please provide your wallet currency");
  }

  const user = await User.findOne({ email });

  const wallet = await Wallet.findOne({
    user_id: user._id,
    currency,
  });

  if (!wallet) {
    res.status(404);
    throw new Error("Wallet not found");
  }

  const transactions = await intasendService.checkWalletTransactions(
    wallet.wallet_id
  );
  console.log(wallet.wallet_id);
  res.status(200).json(transactions);
});

const walletToMpesa = asyncHandler(async (req, res, next) => {
  const { currency, amount, recipientName, recipientPhone, narrative } =
    req.body;
  const email = req.user.email;
  if (!recipientName || !recipientPhone || !amount || !narrative || !currency) {
    res.status(400);
    throw new Error("Please fill in all the fields");
  }

  const user = await User.findOne({ email });

  const wallet = await Wallet.findOne({
    user_id: user._id,
    currency,
  });

  if (!wallet) {
    res.status(404);
    throw new Error("Wallet not found");
  }

  try {
    const transactions = await intasendService.walletToMpesa({
      walletId: wallet.wallet_id,
      recipientName: recipientName,
      recipientPhone: recipientPhone,
      amount: amount,
      currency: currency,
      narrative: narrative,
    });
    console.log(wallet.wallet_id);
    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error in walletToMpesa:", error);
    res.status(500);
    throw new Error("An error occurred while processing your request.");
  }
});

const walletToWallet = asyncHandler(async (req, res, next) => {
  const { currency, amount, destination_wallet_id, narrative } = req.body;
  const email = req.user.email;
  if (!destination_wallet_id || !amount || !narrative || !currency) {
    res.status(400);
    throw new Error("Please fill in all the fields");
  }

  const user = await User.findOne({ email });

  const wallet = await Wallet.findOne({
    user_id: user._id,
    currency,
  });

  if (!wallet) {
    res.status(404);
    throw new Error("Wallet not found");
  }

  try {
    const transactions = await intasendService.walletToWallet({
      sourceWalletId: wallet.wallet_id,
      destinationWalletId: destination_wallet_id,
      amount: amount,
      narrative: narrative,
    });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500);
    throw new Error("An error occurred while processing your request.");
  }
});

const currentUser = asyncHandler(async (req, res, next) => {
  const { email } = req.user;
  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  res.status(200).json(user);
});

module.exports = {
  signup,
  createWallet,
  currentUser,
  retrieveUserWallets,
  fundWallet,
  walletToMpesa,
  walletToWallet,
  retrieveTransactions,
};
