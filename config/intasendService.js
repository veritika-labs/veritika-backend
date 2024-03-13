const IntaSend = require("intasend-node");
const asyncHandler = require("express-async-handler");

class IntaSendService {
  constructor(publishableKey, secretKey, testMode = true) {
    this.intaSend = new IntaSend(publishableKey, secretKey, testMode);
    this.wallets = this.intaSend.wallets();
    this.collection = this.intaSend.collection();
  }

  async createWallet({ label, wallet_type, currency, can_disburse }) {
    try {
      const response = await this.wallets.create({
        label: label,
        wallet_type: wallet_type,
        currency: currency,
        can_disburse: can_disburse,
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async retrieveWallets() {
    try {
      const walletsList = await this.wallets.list();
      return walletsList;
    } catch (error) {
      throw error;
    }
  }

  async fundWallet({
    firstName,
    lastName,
    email,
    amount,
    phoneNumber,
    apiRef,
    walletId,
  }) {
    const response = await this.wallets.fundMPesa({
      first_name: firstName,
      last_name: lastName,
      email: email,
      amount: amount,
      phone_number: phoneNumber,
      host: "http://localhost:5000",
      api_ref: apiRef,
      wallet_id: walletId,
    });
    if (response) {
      return response;
    } else {
      res.status(400);
      throw new Error(error);
    }
  }

  async makePayment({ name, email, amount, phoneNumber, apiRef }) {
    try {
      const response = await this.collection.mpesaStkPush({
        name: name,
        email: email,
        amount: amount,
        phone_number: phoneNumber,
        api_ref: apiRef,
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async checkPaymentStatus(invoiceId) {
    try {
      const response = await this.collection.status(invoiceId);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async retrieveTransactions(walletId) {
    try {
      const response = await this.wallets.transactions(walletId);
      return response;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = IntaSendService;
