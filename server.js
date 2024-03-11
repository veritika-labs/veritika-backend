const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const dotenv = require("dotenv").config();
const app = express();
const port = process.env.PORT;

app.use(express.json());


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    });