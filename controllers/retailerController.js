const asyncHandler = require("express-async-handler");
const IntaSendService = require("../config/intasendService");
const intasendService = new IntaSendService(
  process.env.PUBLICKEY,
  process.env.PIRVATEKEY
);

const createWallet = asyncHandler(async (req, res, next) => {
  const { name, email, phoneNumber } = req.body;

  try {
    const walletResponse = await intasendService.createWallet({
      label: "TEST WALLET",
      wallet_type: "WORKING",
      currency: "KES",
      can_disburse: true,
    });

    if (walletResponse) {
      const response = {
        wallet: walletResponse,
        name: name,
        email: email,
        phoneNumber: phoneNumber,
      };

      res.status(201).json(response);
    }
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

const fundWallet = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email, amount, phoneNumber, apiRef, walletId } =
    req.body;

    if(!firstName || !lastName || !email || !amount || !phoneNumber || !apiRef || !walletId){
      res.status(400);
      throw new Error("Please fill all the fields")
    }

    const fundResponse = await intasendService.fundWallet({
      firstName: firstName,
      lastName: lastName,
      email: email,
      amount: amount,
      phoneNumber: phoneNumber,
      walletId: walletId,
    });

    sleep(20)
    .then(() => {
      res.status(200).json(fundResponse);
    })

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
  createWallet,
  retrieveWallets,
  fundWallet,
  retrieveTransactions,
};
