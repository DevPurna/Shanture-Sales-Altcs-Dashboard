// backend/models/customer.js
const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({ 
  name: String,
  region: String,
  type: String,
});

module.exports = mongoose.model("Customer", customerSchema);
