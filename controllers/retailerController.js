const asyncHandler = require("express-async-handler");
const IntaSendService = require("../config/intasendService");
const intasendService = new IntaSendService(
  process.env.PUBLISHABLE_KEY_INTASEND,
  process.env.SECRET_KEY_INTASEND
);

const createWallet = asyncHandler(async (req, res, next) => {
  const { name, email, phoneNumber } = req.body;

  try {
   
    const walletResponse = await intasendService.createWallet({
      label: "NodeJS-SDK-TEST",
      wallet_type: "WORKING",
      currency: "KES",
      can_disburse: true,
    });

    const response = {
      wallet: walletResponse,
      name: name,
      email: email,
      phoneNumber: phoneNumber,
    };

    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ error: "Error creating wallet" });
  }
});

const retrieveWallets = asyncHandler(async (req, res, next) => {
  try {
    const walletsList = await intasendService.retrieveWallets();
    res.status(200).json(walletsList);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving wallets" });
  }
});



module.exports = {
  createWallet,
  retrieveWallets,
};
