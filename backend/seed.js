// backend/seed.js

const mongoose = require("mongoose"); // For DB connection
const { faker } = require("@faker-js/faker"); // For generating fake data
require("dotenv").config(); // Load .env

const Customer = require("./models/Customer");
const Product = require("./models/Product");
const Sale = require("./models/Sales");

// 1. Connect DB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    seedData();
  })
  .catch((err) => console.error("❌ MongoDB Error:", err));

async function seedData() {
  try {
    // 2. Clear old data
    await Customer.deleteMany();
    await Product.deleteMany();
    await Sale.deleteMany();
    console.log("🧹 Old data wiped!");

    // 3. Insert Customers
    const customers = [];
    for (let i = 0; i < 20; i++) {
      customers.push({
        name: faker.person.fullName(),
        region: faker.helpers.arrayElement(["North", "South", "East", "West"]),
        type: faker.helpers.arrayElement(["Individual", "Business"]),
      });
    }
    const savedCustomers = await Customer.insertMany(customers);
    console.log("👥 20 Customers added");

    // 4. Insert Products
    const products = [];
    for (let i = 0; i < 15; i++) {
      products.push({
        name: faker.commerce.productName(),
        category: faker.commerce.department(),
        price: faker.number.int({ min: 100, max: 5000 }),
      });
    }
    const savedProducts = await Product.insertMany(products);
    console.log("📦 15 Products added");

    const sales = [];
    const today = new Date();
    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(today.getFullYear() - 2);

    for (let i = 0; i < 500; i++) {
      const customer = faker.helpers.arrayElement(savedCustomers);
      const product = faker.helpers.arrayElement(savedProducts);
      const quantity = faker.number.int({ min: 1, max: 5 });
      const totalRevenue = product.price * quantity;

      const reportDate = faker.date.between({ from: twoYearsAgo, to: today });

      sales.push({
        customerId: customer._id,
        productId: product._id,
        quantity,
        totalRevenue,
        reportDate,
      });
    }

    await Sale.insertMany(sales);
    console.log("💰 500 Sales added");

    console.log("🎉 Database Seeded Successfully!");
    process.exit();
  } catch (err) {
    console.error("❌ Seeding Error:", err);
    process.exit(1);
  }
}
