import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL;

const API = axios.create({
  baseURL: `${API_BASE}/analytics`, // backend URL
});

// Revenue
export const getRevenue = (startDate, endDate) =>
  API.get(`/revenue?startDate=${startDate}&endDate=${endDate}`);

// Top Products
export const getTopProducts = (startDate, endDate) =>
  API.get(`/top-products?startDate=${startDate}&endDate=${endDate}`);

// Top Customers
export const getTopCustomers = (startDate, endDate) =>
  API.get(`/top-customers?startDate=${startDate}&endDate=${endDate}`);

// Region Stats
export const getRegionStats = (startDate, endDate) =>
  API.get(`/region-stats?startDate=${startDate}&endDate=${endDate}`);

// History
export const getHistory = () => API.get("/history");
