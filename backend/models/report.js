// backend/models/report.js
const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  reportDate: { type: Date, default: Date.now },
  totalRevenue: Number,
  avgOrderValue: Number
});

module.exports = mongoose.model('Report', reportSchema);
