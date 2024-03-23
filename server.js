const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const dotenv = require("dotenv").config();
const app = express();
const port = process.env.PORT;
const connectDb = require("./config/database");

app.use(express.json());

app.use("/api/client", require("./routes/clientRoute"));
app.use("/api/retailer", require("./routes/retailerRoute"));
app.use(errorHandler);

connectDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database:", err);
  });
