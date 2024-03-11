const mongoose = require("mongoose");

const connectDb = async () =>{
  try {
    const connection = await mongoose.connect(process.env.MONGOSTRING);
    console.log(
      "DB connected:",
      connection.connection.host,
      connection.connection.name
    );
  } catch (error) {
    console.error("DB connection error:", error);
    process.exit(1);
  }
}

module.exports = connectDb;
