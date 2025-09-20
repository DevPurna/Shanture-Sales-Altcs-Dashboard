const Sales = require("../models/Sales");
const Customer = require("../models/Customer");
const Product = require("../models/Product");
const Report = require("../models/report");

// Total Revenue
exports.getRevenue = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const start = startDate ? new Date(startDate) : new Date("2000-01-01");
    const end = endDate ? new Date(endDate) : new Date();

    const result = await Sales.aggregate([
      {
        $match: {
          reportDate: { $gte: start, $lte: end },
        },
      },
      {
        $group: { _id: null, totalRevenue: { $sum: "$totalRevenue" } },
      },
    ]);

    res.json(result[0] || { totalRevenue: 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Top Products
exports.getTopProducts = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const result = await Sales.aggregate([
      {
        $match: {
          reportDate: { $gte: new Date(startDate), $lte: new Date(endDate) },
        },
      },
      {
        $group: {
          _id: "$productId",
          totalQuantity: { $sum: "$quantity" },
          totalRevenue: { $sum: "$totalRevenue" },
        },
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $project: {
          _id: 0, 
          productId: "$_id",
          productName: "$product.name", 
          totalQuantity: 1,
          totalRevenue: 1,
        },
      },
    ]);

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Top Customers
exports.getTopCustomers = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const result = await Sales.aggregate([
      {
        $match: {
          reportDate: { $gte: new Date(startDate), $lte: new Date(endDate) },
        },
      },
      {
        $group: {
          _id: "$customerId",
          totalRevenue: { $sum: "$totalRevenue" },
        },
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "customers",
          localField: "_id",
          foreignField: "_id",
          as: "customer",
        },
      },
      { $unwind: "$customer" },
      {
        $project: {
          _id: 0,
          customerId: "$_id",
          customerName: "$customer.name",
          region: "$customer.region",
          totalRevenue: 1,
        },
      },
    ]);

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Region Stats
exports.getRegionStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const result = await Sales.aggregate([
      {
        $match: {
          reportDate: { $gte: new Date(startDate), $lte: new Date(endDate) },
        },
      },
      {
        $lookup: {
          from: "customers",
          localField: "customerId",
          foreignField: "_id",
          as: "customer",
        },
      },
      { $unwind: "$customer" },
      {
        $group: {
          _id: "$customer.region",
          totalRevenue: { $sum: "$totalRevenue" },
        },
      },
      {
        $project: { _id: 0, region: "$_id", totalRevenue: 1 },
      },
    ]);

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Reports History
exports.saveReport = async (req, res) => {
  try {
    const { reportDate, totalRevenue, avgOrderValue } = req.body;

    const newReport = new Report({
      reportDate,
      totalRevenue,
      avgOrderValue,
    });

    await newReport.save();
    res.json(newReport);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getReportsHistory = async (req, res) => {
  try {
    const reports = await Report.find().sort({ reportDate: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
