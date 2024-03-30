const IntaSend = require("intasend-node");

class IntaSendService {
  constructor(publishableKey, secretKey, testMode = true) {
    this.intaSend = new IntaSend(publishableKey, secretKey, testMode);
    this.wallets = this.intaSend.wallets();
    this.collection = this.intaSend.collection();
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
      console.error("Error creating wallet:", error);
      throw new Error("Failed to create wallet");
    }
  }

  async retrieveWallets() {
    try {
      const walletsList = await this.wallets.list();
      return walletsList;
    } catch (error) {
      throw new Error("Failed to retrieve wallets");
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
      throw new Error("Failed to fund wallet from M-Pesa");
    }
  }

  async walletToWallet({
    sourceWalletId,
    destinationWalletId,
    amount,
    narrative,
  }) {
    try {
      const resp = await wallets.intraTransfer(
        sourceWalletId,
        destinationWalletId,
        amount,
        narrative
      );
      return resp;
    } catch (err) {
      console.error(`Intra Transfer error:`, err);
      throw new Error("Failed to perform wallet to wallet transfer");
    }
  }

  async walletToMpesa(
    walletId,
    recipientName,
    recipientPhone,
    amount,
    narrative
  ) {
    try {
      const resp = await this.intaSend.payouts().mpesa({
        currency: "KES",
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
      return "Wallet-to-MPesa transfer successful";
    } catch (error) {
      throw new Error("Failed to transfer funds to MPesa");
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
      throw new Error("Failed to make payment");
    }
  }

  async checkPaymentStatus(invoiceId) {
    try {
      const response = await this.collection.status(invoiceId);
      return response;
    } catch (error) {
      throw new Error("Failed to check payment status");
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
      throw new Error(error);
    }
  }
}

module.exports = IntaSendService;
