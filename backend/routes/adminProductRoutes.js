import express from "express";
import Product from "../models/Product.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// @route GET /api/admin/products
// @desc Get all products (Admin only)
// @access Private/Admin
router.get(
  "/",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.status(200).json(products);
  })
);

// @route POST /api/admin/products
// @desc Create a new Product
// @access Private/Admin
router.post(
  "/",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const {
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      // dimensions,
      // weight,
      sku,
    } = req.body;

    price = Number(price);
    discountPrice = Number(discountPrice);
    countInStock = Number(countInStock);

    const product = new Product({
      user: req.user._id, // Reference to the admin user who created it
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      // dimensions,
      //weight,
      sku,
    });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  })
);

// @route PUT /api/admin/products/:id
// @desc Update an existing product ID
// @access Private/Admin
router.put(
  "/:id",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const {
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      // dimensions,
      //weight,
      sku,
    } = req.body;

    price = Number(price);
    discountPrice = Number(discountPrice);
    countInStock = Number(countInStock);

    // Find product by ID
    const product = await Product.findById(req.params.id);
    console.log(req.body);

    if (product) {
      // Update product fields
      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price ?? product.price; // "??" is used to preserve 0 if price is set to 0; fallback only if undefined or null
      product.discountPrice = discountPrice ?? product.discountPrice;
      product.countInStock = countInStock ?? product.countInStock;
      product.category = category || product.category;
      product.brand = brand || product.brand;
      product.sizes = sizes || product.sizes;
      product.colors = colors || product.colors;
      product.collections = collections || product.collections;
      product.material = material || product.material;
      product.gender = gender || product.gender;
      product.images = images || product.images;
      product.isFeatured = isFeatured ?? product.isFeatured; // "??" is used to preserve false  if price is set to false ; fallback only if undefined or null
      product.isPublished = isPublished ?? product.isPublished;
      product.tags = tags || product.tags;
      // product.dimensions = dimensions || product.dimensions;
      // product.weight = weight ?? product.weight;
      product.sku = sku || product.sku;

      const updatedProduct = await product.save();
      res.status(200).json(updatedProduct);
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  })
);

// @route DELETE /api/admin/products/:id
// @desc Delete a product by ID
// @access Private/Admin
router.delete(
  "/:id",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    // Find the product by ID
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    const publicIds = product.images.map((img) => img.public_id);

    let cloudinaryResults = [];
    if (publicIds.length > 0) {
      cloudinaryResults = await Promise.all(
        publicIds.map((id) => cloudinary.uploader.destroy(id))
      );
    }

    // Remove the product from DB
    await product.deleteOne();
    res.status(200).json({
      message: "Product and its images removed successfully",
      cloudinaryResults,
    });
  })
);

export default router;
