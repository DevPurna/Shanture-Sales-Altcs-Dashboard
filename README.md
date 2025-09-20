# 📊 Sales Analytics Dashboard

A **full-stack web application** to track, analyze, and visualize sales data with interactive charts and reports. Built using the **MERN stack** (MongoDB, Express, React, Node.js) with real-time updates via **Socket.IO**.

---

## 🚀 Features

- **Dashboard:** View total revenue, top products, top customers, and regional sales stats.
- **Reports History:** Create, save, and view past reports.
- **Realtime Updates:** Live updates for new sales using Socket.IO.
- **Data Seeding:** Faker.js to generate fake data for testing.
- **Charts & Graphs:** Interactive and responsive visualizations with Chart.js.

---

## 🛠 Technologies Used

- **Frontend:** React.js, Chart.js
- **Backend:** Node.js, Express.js, Socket.IO
- **Database:** MongoDB, Mongoose
- **Other Tools:** Faker.js for fake data generation

---

## 📂 Project Structure

project-root/
├─ backend/
│ ├─ config/ # Database connection configuration
│ ├─ controllers/ # API controllers
│ ├─ models/ # Mongoose models
│ ├─ routes/ # API routes
│ ├─ .env # Local environment variables
│ ├─ .env.example # Example env file
│ ├─ server.js # Backend entry point
│ └─ seed.js # Seed database with fake data
│
├─ frontend/
│ ├─ src/ # React source code
│ ├─ public/ # Static assets
│ ├─ .env # Local environment variables
│ └─ .env.example # Example env file
│
└─ README.md

---

## 🗄 Database Schema

### 1. Sales

| Field        | Type                    | Description                     |
| ------------ | ----------------------- | ------------------------------- |
| customerId   | ObjectId (ref Customer) | Customer who made the sale      |
| productId    | ObjectId (ref Product)  | Product sold                    |
| quantity     | Number                  | Quantity of product sold        |
| totalRevenue | Number                  | Revenue generated from the sale |
| reportDate   | Date                    | Date of the sale                |

**Indexes:** `reportDate`, `productId`, `customerId`

---

### 2. Product

| Field    | Type   | Description      |
| -------- | ------ | ---------------- |
| name     | String | Name of product  |
| category | String | Product category |
| price    | Number | Unit price       |

---

### 3. Customer

| Field  | Type   | Description                      |
| ------ | ------ | -------------------------------- |
| name   | String | Customer name                    |
| region | String | Customer region                  |
| type   | String | Customer type (retail/wholesale) |

---

### 4. Report

| Field         | Type   | Description                 |
| ------------- | ------ | --------------------------- |
| reportDate    | Date   | Date of the report          |
| totalRevenue  | Number | Total revenue in the report |
| avgOrderValue | Number | Average order value         |

---

## 🌐 API Endpoints

Base URL: `https://<backend-url>/api/analytics`

| Endpoint         | Method | Description                      | Query/Body Parameters                         |
| ---------------- | ------ | -------------------------------- | --------------------------------------------- |
| `/revenue`       | GET    | Total revenue between dates      | `startDate`, `endDate`                        |
| `/top-products`  | GET    | Top 5 products by revenue        | `startDate`, `endDate`                        |
| `/top-customers` | GET    | Top 5 customers by revenue       | `startDate`, `endDate`                        |
| `/region-stats`  | GET    | Revenue stats by customer region | `startDate`, `endDate`                        |
| `/history`       | GET    | Fetch historical reports         | -                                             |
| `/history`       | POST   | Save a new report                | `reportDate`, `totalRevenue`, `avgOrderValue` |

---

## 📊 Aggregation Pipelines

### Total Revenue

```js
Sales.aggregate([
  { $match: { reportDate: { $gte: start, $lte: end } } },
  { $group: { _id: null, totalRevenue: { $sum: "$totalRevenue" } } }
]);


Top Products

Sales.aggregate([
  { $match: { reportDate: { $gte: start, $lte: end } } },
  { $group: { _id: "$productId", totalQuantity: { $sum: "$quantity" }, totalRevenue: { $sum: "$totalRevenue" } } },
  { $sort: { totalRevenue: -1 } },
  { $limit: 5 },
  { $lookup: { from: "products", localField: "_id", foreignField: "_id", as: "product" } },
  { $unwind: "$product" },
  { $project: { _id: 0, productId: "$_id", productName: "$product.name", totalQuantity: 1, totalRevenue: 1 } }
]);

Similar pipelines are used for Top Customers (grouped by customerId) and Region Stats (grouped by customer region).


⚙️ Setup & Run Instructions
Backend

git clone https://shanture-sales-altcs-dashboard.onrender.com
cd backend
npm install

Create a .env file:

MONGO_URI=mongodb+srv://PurnaUser0:Sarma%4020461@cluster0.c3e8n9i.mongodb.net/salesdb?retryWrites=true&w=majority&appName=Cluster0
CLIENT_URL=http://localhost:3000
PORT=5000

Run the backend server:
npm run dev
Access backend: http://localhost:5000

Frontend

cd frontend
npm install

Create a .env file:
REACT_APP_API_URL=http://localhost:5000/api

Run the frontend:
npm start
Access frontend: http://localhost:3000

☁️ Deployment
Backend: Deploy on Render or Heroku. Set CLIENT_URL to frontend URL.
Frontend: Deploy on Vercel. Set REACT_APP_API_URL to deployed backend URL.

🔄 Real-time Updates
Socket.IO integrated for live sales updates.
Backend emits newSale events on new sales.
Frontend listens to events and updates charts automatically.

⚠️ Notes
Ensure MongoDB IDs (customerId, productId) match the respective collections for accurate aggregations.
Date filters must use ISO format (YYYY-MM-DD).
Configure frontend and backend URLs correctly in .env files for deployment.
```
