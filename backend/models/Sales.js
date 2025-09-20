// backend/models/Sales.js
const mongoose = require("mongoose");
const saleSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  quantity: Number,
  totalRevenue: Number,
  reportDate: Date,
});
saleSchema.index({ reportDate: 1 }); // Index for date range queries
saleSchema.index({ productId: 1 }); // Index for product-based queries
saleSchema.index({ customerId: 1 }); // Index for customer-based queries

module.exports = mongoose.model("Sale", saleSchema, "sales");
