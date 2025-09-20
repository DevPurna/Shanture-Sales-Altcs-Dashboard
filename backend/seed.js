// backend/seed.js

const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
require("dotenv").config();

const Customer = require("./models/Customer");
const Product = require("./models/Product");
const Sale = require("./models/Sales");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    seedData();
  })
  .catch((err) => console.error("❌ MongoDB Error:", err));

async function seedData() {
  try {
    // Clear old data
    await Customer.deleteMany();
    await Product.deleteMany();
    await Sale.deleteMany();
    console.log("🧹 Old data wiped!");

    // Insert Customers
    const customers = Array.from({ length: 20 }).map(() => ({
      name: faker.person.fullName(),
      region: faker.helpers.arrayElement(["North", "South", "East", "West"]),
      type: faker.helpers.arrayElement(["Individual", "Business"]),
    }));
    const savedCustomers = await Customer.insertMany(customers);

    // Map customer IDs
    const customerIds = savedCustomers.map((c) => c._id);
    console.log("👥 20 Customers added");

    // Insert Products
    const products = Array.from({ length: 15 }).map(() => ({
      name: faker.commerce.productName(),
      category: faker.commerce.department(),
      price: faker.number.int({ min: 100, max: 5000 }),
    }));
    const savedProducts = await Product.insertMany(products);

    // Map product IDs
    const productIds = savedProducts.map((p) => p._id);
    console.log("📦 15 Products added");

    // Insert Sales with correct references
    const sales = Array.from({ length: 500 }).map(() => {
      const customerId = faker.helpers.arrayElement(customerIds);
      const productId = faker.helpers.arrayElement(productIds);
      const quantity = faker.number.int({ min: 1, max: 5 });
      const totalRevenue =
        savedProducts.find((p) => p._id.equals(productId)).price * quantity;
      const reportDate = faker.date.between({
        from: new Date(new Date().setFullYear(new Date().getFullYear() - 2)),
        to: new Date(),
      });

      return { customerId, productId, quantity, totalRevenue, reportDate };
    });

    await Sale.insertMany(sales);
    console.log("💰 500 Sales added");

    console.log("🎉 Database Seeded Successfully!");
    process.exit();
  } catch (err) {
    console.error("❌ Seeding Error:", err);
    process.exit(1);
  }
}
