const IntaSend = require("intasend-node");

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
}

module.exports = IntaSendService;
