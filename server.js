const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const dotenv = require("dotenv").config();
const app = express();
const port = process.env.PORT;
const connectDb = require("./config/database");
const IntaSendService = require("./config/intasendService");

const intaSendService = new IntaSendService(
  process.env.PUBLICKEY,
  process.env.PIRVATEKEY
);

connectDb();

app.use(express.json());

app.use("/api/client", require("./routes/clientRoute"));
app.use("/api/retailer", require("./routes/retailerRoute"));
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// dummy wallet
intaSendService
  .createWallet({
    label: "Test Wallet",
    wallet_type: "WORKING",
    currency: "KES",
    can_disburse: false,
  })
  .then((response) => {
    console.log("Intasend service is up and running");
  })
  .catch((error) => {
    // Convert the Buffer to a string
    const errorMessage = error.toString();
    console.error(
      "There was an error with the Intasend service:",
      errorMessage
    );
  });