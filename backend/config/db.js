// backend/config/db.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI); // Use MONGO_URI from .env
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("DB connection failed", error); 
    process.exit(1);
  }
};

module.exports = connectDB;
