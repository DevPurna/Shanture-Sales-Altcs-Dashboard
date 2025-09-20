// backend/routes/analytics.js
const express = require('express');
const router = express.Router();
const {
  getRevenue,
  getTopProducts,
  getTopCustomers,
  getRegionStats,
  saveReport,
  getReportsHistory
} = require('../controllers/analyticsController');

// Revenue
router.get('/revenue', getRevenue);

// Top Products
router.get('/top-products', getTopProducts);

// Top Customers
router.get('/top-customers', getTopCustomers);

// Region Stats
router.get('/region-stats', getRegionStats);

// Reports History
router.post('/history', saveReport);
router.get('/history', getReportsHistory);

module.exports = router;
