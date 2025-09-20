// src/components/Dashboard.js
import React, { useState, useEffect } from "react";
import {
  Card,  
  CardContent,
  Typography,
  CircularProgress, 
  Container,
  Box,
} from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Date picker styles
import ReactECharts from "echarts-for-react"; 
import io from "socket.io-client"; // Add socket.io-client
import {
  getRevenue,
  getTopProducts,
  getTopCustomers,
  getRegionStats,
  getHistory,
} from "../services/api";
import "./Dashboard.css";

// connect socket to deployed backend
const socket = io("https://shanture-sales-altcs-dashboard.onrender.com/");

const Dashboard = () => {
  const [startDate, setStartDate] = useState(new Date("2024-01-01"));
  const [endDate, setEndDate] = useState(new Date("2025-12-31"));
  const [revenue, setRevenue] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [regionStats, setRegionStats] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // Initial fetch
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const start = startDate.toISOString();
      const end = endDate.toISOString();

      const rev = await getRevenue(start, end);
      setRevenue(rev.data.totalRevenue);

      const products = await getTopProducts(start, end);
      setTopProducts(products.data);

      const customers = await getTopCustomers(start, end);
      setTopCustomers(customers.data);

      const regions = await getRegionStats(start, end);
      setRegionStats(regions.data);

      const hist = await getHistory();
      setHistory(hist.data);

      setLoading(false);
    };
    fetchData();
  }, [startDate, endDate]);

  // Live updates with socket.io
  useEffect(() => {
    socket.on("newSale", (sale) => {
      console.log("📡 New Sale received:", sale);

      // Update revenue directly
      setRevenue((prev) => (prev || 0) + sale.totalRevenue);

      // Update topProducts
      setTopProducts((prev) => {
        const existing = prev.find((p) => p.productId === sale.productId);
        if (existing) {
          return prev.map((p) =>
            p.productId === sale.productId
              ? {
                  ...p,
                  totalRevenue: (p.totalRevenue || 0) + (sale.totalRevenue || 0),
                  totalQuantity: (p.totalQuantity || 0) + (sale.quantity || 0),
                }
              : p
          );
        } else {
          return [
            ...prev,
            {
              productId: sale.productId,
              productName: sale.productName || "Unknown",
              totalRevenue: sale.totalRevenue || 0,
              totalQuantity: sale.quantity || 0,
            },
          ];
        }
      });

      // Update topCustomers
      setTopCustomers((prev) => {
        const existing = prev.find((c) => c.customerId === sale.customerId);
        if (existing) {
          return prev.map((c) =>
            c.customerId === sale.customerId
              ? { ...c, totalRevenue: (c.totalRevenue || 0) + (sale.totalRevenue || 0) }
              : c
          );
        } else {
          return [
            ...prev,
            {
              customerId: sale.customerId,
              customerName: sale.customerName || "New Customer",
              totalRevenue: sale.totalRevenue || 0,
            },
          ];
        }
      });

      // Update region stats
      setRegionStats((prev) => {
        const existing = prev.find((r) => r.region === sale.region);
        if (existing) {
          return prev.map((r) =>
            r.region === sale.region
              ? { ...r, totalRevenue: (r.totalRevenue || 0) + (sale.totalRevenue || 0) }
              : r
          );
        } else {
          return [
            ...prev,
            {
              region: sale.region || "Unknown",
              totalRevenue: sale.totalRevenue || 0,
            },
          ];
        }
      });

      // Add to history
      setHistory((prev) => [
        ...prev,
        {
          reportDate: new Date(),
          totalRevenue: sale.totalRevenue || 0,
          avgOrderValue: sale.quantity ? (sale.totalRevenue || 0) / sale.quantity : 0,
        },
      ]);
    });

    return () => {
      socket.off("newSale");
    };
  }, []);

  if (loading)
    return <CircularProgress sx={{ display: "block", margin: "50px auto" }} />;

  return (
    <Container
      sx={{
        paddingY: 4,
        background: "linear-gradient(135deg, #f5f7fa 0%, #e0eafc 100%)",
        minHeight: "100vh",
        minWidth: "100%",
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          color: "#1976d2",
          fontWeight: "bold",
          textAlign: "center",
          textShadow: "1px 1px 2px rgba(0,0,0,0.2)",
          marginBottom: 3,
        }}
      >
        📊 Sales Analytics Dashboard
      </Typography>

      {/* Date Pickers */}
      <Box sx={{ display: "flex", marginBottom: 3 }}>
        <DatePicker
          selected={startDate}
          onChange={(d) => setStartDate(d)}
          className="custom-datepicker"
          wrapperClassName="datepicker-wrapper"
          placeholderText="Start Date"
        />
        <DatePicker
          selected={endDate}
          onChange={(d) => setEndDate(d)}
          className="custom-datepicker"
          wrapperClassName="datepicker-wrapper"
          placeholderText="End Date"
        />
      </Box>

      {/* Total Revenue */}
      <Card
        sx={{
          marginBottom: 3,
          borderRadius: 3,
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          background: "linear-gradient(135deg, #f5f7ff, #ffffff)",
          padding: 2,
        }}
      >
        <CardContent sx={{ textAlign: "center" }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: 600, color: "#555", letterSpacing: 0.5 }}
          >
            💰Total Revenue
          </Typography>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: "#3f51b5",
              marginTop: 1,
              textShadow: "1px 1px 2px rgba(63, 81, 181, 0.15)",
            }}
          >
            ₹{revenue?.toLocaleString("en-IN")}
          </Typography>
        </CardContent>
      </Card>

      {/* Top Products */}
      <Card
        sx={{
          marginBottom: 3,
          borderRadius: 3,
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          background: "#ffffff",
          padding: 2,
        }}
      >
        <CardContent>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "#333",
              marginBottom: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            📦Top Products
          </Typography>

          <ReactECharts
            option={{
              tooltip: {
                trigger: "axis",
                axisPointer: { type: "shadow" },
                formatter: (params) => {
                  const p = params[0];
                  const product = topProducts.find(
                    (tp) => tp.productName === p.name
                  );
                  return `
              <strong>${p.name}</strong><br/>
              Revenue: ₹${p.value?.toLocaleString("en-IN")}<br/>
              Quantity Sold: ${product?.totalQuantity}
            `;
                },
              },
              xAxis: {
                type: "category",
                data: topProducts.map((p) => p.productName),
                axisLabel: {
                  interval: 0,
                  formatter: (value) =>
                    value.length > 20 ? value.slice(0, 20) + "..." : value,
                },
              },
              yAxis: {
                type: "value",
                name: "Revenue (₹)",
                axisLine: { show: false },
                splitLine: { lineStyle: { color: "#eee" } },
              },
              series: [
                {
                  type: "bar",
                  data: topProducts.map((p) => p.totalRevenue),
                  itemStyle: {
                    color: "#3f51b5",
                    borderRadius: [6, 6, 0, 0],
                  },
                  barWidth: "50%",
                },
              ],
            }}
            style={{ height: "320px" }}
          />
        </CardContent>
      </Card>

      {/* Top Customers */}
      <Card
        sx={{
          marginBottom: 3,
          borderRadius: 3,
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          background: "#ffffff",
          padding: 2,
        }}
      >
        <CardContent>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "#333",
              marginBottom: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            👥 Top Customers
          </Typography>
          <ReactECharts
            option={{
              tooltip: {
                trigger: "axis",
                axisPointer: { type: "shadow" },
                formatter: (params) => {
                  const c = params[0];
                  return `
              <strong>${c.name}</strong><br/>
              Total Spent: ₹${c.value?.toLocaleString("en-IN")}
            `;
                },
              },
              xAxis: {
                type: "category",
                data: topCustomers.map((c) => c.customerName || "Unknown"),
                axisLabel: {
                  interval: 0,
                  formatter: (value) =>
                    value.length > 20 ? value.slice(0, 20) + "..." : value,
                },
              },
              yAxis: {
                type: "value",
                name: "Revenue (₹)",
                axisLine: { show: false },
                splitLine: { lineStyle: { color: "#eee" } },
              },
              series: [
                {
                  type: "bar",
                  data: topCustomers.map((c) => c.totalRevenue),
                  itemStyle: {
                    color: "#ff9800",
                    borderRadius: [6, 6, 0, 0],
                  },
                  barWidth: "50%",
                },
              ],
            }}
            style={{ height: "320px" }}
          />
        </CardContent>
      </Card>

      {/* Region Stats */}
      <Card
        sx={{
          marginBottom: 3,
          borderRadius: 3,
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          background: "#ffffff",
          padding: 2,
        }}
      >
        <CardContent>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "#333",
              marginBottom: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            🌍 Region Stats
          </Typography>

          <ReactECharts
            option={{
              tooltip: { trigger: "item", formatter: "{b}: ₹{c} ({d}%)" },
              legend: {
                orient: "horizontal",
                bottom: 0,
                textStyle: { fontSize: 12 },
              },
              series: [
                {
                  type: "pie",
                  radius: ["35%", "60%"],
                  avoidLabelOverlap: false,
                  itemStyle: {
                    borderRadius: 6,
                    borderColor: "#fff",
                    borderWidth: 2,
                  },
                  label: { show: false, position: "center" },
                  emphasis: {
                    label: {
                      show: true,
                      fontSize: 16,
                      fontWeight: "bold",
                    },
                  },
                  labelLine: { show: false },
                  data: regionStats.map((r) => ({
                    name: r.region,
                    value: r.totalRevenue,
                  })),
                },
              ],
            }}
            style={{ height: "320px" }}
          />
        </CardContent>
      </Card>

      {/* Reports History */}
      <Card
        sx={{
          marginBottom: 3,
          borderRadius: 3,
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          background: "#ffffff",
          padding: 2,
        }}
      >
        <CardContent>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "#333",
              marginBottom: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            📑 Reports History
          </Typography>

          {history.length === 0 ? (
            <Typography sx={{ color: "#888" }}>No reports available</Typography>
          ) : (
            <Box sx={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
              >
                <thead style={{ background: "#f5f5f5" }}>
                  <tr>
                    <th style={{ textAlign: "left", padding: "10px" }}>Date</th>
                    <th style={{ textAlign: "left", padding: "10px" }}>
                      Revenue (₹)
                    </th>
                    <th style={{ textAlign: "left", padding: "10px" }}>
                      Avg Order Value (₹)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((h, i) => (
                    <tr
                      key={i}
                      style={{
                        borderBottom: "1px solid #eee",
                        background: i % 2 === 0 ? "#fff" : "#fafafa", // striped rows
                      }}
                    >
                      <td style={{ padding: "10px" }}>
                        {new Date(h.reportDate).toLocaleDateString()}
                      </td>
                      <td
                        style={{
                          padding: "10px",
                          fontWeight: 500,
                          color: "#3f51b5",
                        }}
                      >
                        ₹{h.totalRevenue.toLocaleString()}
                      </td>
                      <td style={{ padding: "10px" }}>
                        {h.avgOrderValue
                          ? `₹${h.avgOrderValue.toLocaleString()}`
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default Dashboard;
