import mongoose, { connect } from "mongoose";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import Product from "./models/Product.js";
import User from "./models/User.js";
import Cart from "./models/Cart.js";
import products from "./data/products.js";
import colors from "colors";

dotenv.config();

connectDB();

// Function to seed data
const seedData = async (req, res) => {
  try {
    // Clear existing data
    // await User.deleteMany();
    await Product.deleteMany();
    // await Cart.deleteMany();

    // const createdUser = await User.create({
    //   name: "Admin User",
    //   email: "admin@example.com",
    //   password: "123456",
    //   role: "admin",
    // });

    // Assign the default user ID to each product
    // const userID = createdUser._id;

    const sampleProducts = products.map((product) => {
      return { user: "6820c657c9d97bc217639180", ...product };
    });

    // Insert the products into the database
    await Product.insertMany(sampleProducts);
    console.log("Product data seeded successfully".green.inverse);
    process.exit(1);
  } catch (error) {
    console.error("Error seeding the data".red.inverse, `${error}`.red.inverse);
    process.exit(1);
  }
};

seedData();
