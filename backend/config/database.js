const mongoose = require("mongoose");
require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URI, { dbname:"Galileo", useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Database connected"))
  .catch((error) => {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  });

module.exports = mongoose;
