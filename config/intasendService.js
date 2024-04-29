const IntaSend = require("intasend-node");

class IntaSendService {
  constructor(publishableKey, secretKey, testMode = true) {
    this.intaSend = new IntaSend(publishableKey, secretKey, testMode);
    this.wallets = this.intaSend.wallets();
    this.collection = this.intaSend.collection();
    this.payouts = this.intaSend.payouts();
  }

  async createWallet({ label, currency }) {
    try {
      const response = await this.wallets.create({
        label: label,
        wallet_type: "WORKING",
        currency: currency,
        can_disburse: true,
      });
      return response;
    } catch (error) {
      const errorObject = JSON.parse(error);
      const errorMessage = errorObject.errors[0].detail;
      throw errorMessage;
    }
  }

  async retrieveWallets() {
    try {
      const walletsList = await this.wallets.list();
      return walletsList;
    } catch (error) {
      const errorObject = JSON.parse(error);
      const errorMessage = errorObject.errors[0].detail;
      throw errorMessage;
    }
  }

  async mpesaToWallet({
    firstName,
    lastName,
    email,
    amount,
    phoneNumber,
    walletId,
  }) {
    try {
      const response = await this.wallets.fundMPesa({
        first_name: firstName,
        last_name: lastName,
        email: email,
        amount: amount,
        phone_number: phoneNumber,
        host: "http://localhost:5000",
        api_ref: "test",
        wallet_id: walletId,
      });
      return response;
    } catch (error) {
      const errorObject = JSON.parse(error);
      const errorMessage = errorObject.errors[0].detail;
      throw errorMessage;
    }
  }

  async walletToWallet({
    sourceWalletId,
    destinationWalletId,
    amount,
    narrative,
  }) {
    try {
      const resp = await this.wallets.intraTransfer(
        sourceWalletId,
        destinationWalletId,
        amount,
        narrative
      );
      return resp;
    } catch (error) {
      const errorObject = JSON.parse(error);
      const errorMessage = errorObject.errors[0].detail;
      throw errorMessage;
    }
  }

  async walletToMpesa({
    walletId,
    recipientName,
    recipientPhone,
    amount,
    currency,
    narrative
  }) {
    try {
      const resp = await this.payouts.mpesa({
        currency: currency,
        transactions: [
          {
            name: recipientName,
            account: recipientPhone,
            amount: amount,
            narrative: narrative,
          },
        ],
        wallet_id: walletId,
      });
      return resp;
    } catch (error) {
      const errorObject = JSON.parse(error);
      const errorMessage = errorObject.errors[0].detail;
      throw errorMessage;
    }
  }

  async makePayment({ name, email, amount, phoneNumber }) {
    try {
      const response = await this.collection.mpesaStkPush({
        name: name,
        email: email,
        amount: amount,
        phone_number: phoneNumber,
        api_ref: "test",
      });
      return response;
    } catch (error) {
      const errorObject = JSON.parse(error);
      const errorMessage = errorObject.errors[0].detail;
      throw errorMessage;
    }
  }

  async checkPaymentStatus(invoiceId) {
    try {
      const response = await this.collection.status(invoiceId);
      return response;
    } catch (error) {
      const errorObject = JSON.parse(error);
      const errorMessage = errorObject.errors[0].detail;
      throw errorMessage;
    }
  }

  async checkWalletTransactions(wallet_id) {
    try {
      const response = await this.wallets.transactions(wallet_id);
      if (!response) {
        throw new Error("No wallet transactions found");
      }
      return response;
    } catch (error) {
      const errorObject = JSON.parse(error);
      const errorMessage = errorObject.errors[0].detail;
      throw errorMessage;
    }
  }
}

module.exports = IntaSendService;
