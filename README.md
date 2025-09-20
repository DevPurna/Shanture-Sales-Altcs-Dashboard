# Sales Analytics Dashboard

A full-stack web application to track and visualize sales data with interactive analytics, reports, and charts. Built with the **MERN stack** (MongoDB, Express, React, Node.js).

---

## Features

- **Dashboard:** View sales revenue, top products, top customers, and regional stats
- **Reports History:** Create, save, and view past reports
- **Realtime Updates:** Socket.io integration for live sales updates
- **Data Seeding:** Faker.js to generate fake data for testing
- **Charts & Graphs:** Interactive and responsive visualization

---

## Technologies Used

- **Frontend:** React (Create React App), Chart.js
- **Backend:** Node.js, Express.js, Socket.io
- **Database:** MongoDB, Mongoose
- **Other Tools:** Faker.js for fake data generation

---

## Project Structure

project-root/
├─ backend/
│ ├─ config/ # DB connection config
│ ├─ controllers/ # API controllers
│ ├─ models/ # Mongoose models
│ ├─ routes/ # API routes
│ ├─ .env # Local env variables (ignored in git)
│ ├─ .env.example # Example env file
│ ├─ server.js # Backend entry point
│ └─ seed.js # Seed database with fake data
│
├─ frontend/
│ ├─ src/ # React source code
│ ├─ public/ # Static assets
│ ├─ .env # Local env variables (ignored in git)
│ └─ .env.example # Example env file
│
└─ README.md

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/<repo-name>.git
cd project-root

### 2. Backend Setup
cd backend
npm install

Create .env file in backend/:

MONGO_URI=mongodb://127.0.0.1:27017/salesdb
CLIENT_URL=http://localhost:3000
PORT=5000
NODE_ENV=development

Seed the database:
node seed.js
Start the backend server:
npm run dev


### 3. Frontend Setup
cd frontend
npm install

Create .env file in frontend/:

REACT_APP_API_URL=http://localhost:5000

Start the frontend:
npm start

Open http://localhost:3000 to view the dashboard.

## Deployment

Backend: Deploy on Render, Heroku, or any Node.js hosting
Frontend: Deploy on Render (Static Site), Vercel, or Netlify
Update environment variables on the hosting platform instead of committing .env files.
```
