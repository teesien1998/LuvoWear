import express from "express";
import Product from "../models/Product.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import Order from "../models/Order.js";

const router = express.Router();

// // @route POST /api/products
// // @desc Create a new Product
// // @access Private/Admin
// router.post(
//   "/",
//   protect,
//   admin,
//   asyncHandler(async (req, res) => {
//     const {
//       name,
//       description,
//       price,
//       discountPrice,
//       countInStock,
//       category,
//       brand,
//       sizes,
//       colors,
//       collections,
//       material,
//       gender,
//       images,
//       isFeatured,
//       isPublished,
//       tags,
//       dimensions,
//       weight,
//       sku,
//     } = req.body;

//     const product = new Product({
//       user: req.user._id, // Reference to the admin user who created it
//       name,
//       description,
//       price,
//       discountPrice,
//       countInStock,
//       category,
//       brand,
//       sizes,
//       colors,
//       collections,
//       material,
//       gender,
//       images,
//       isFeatured,
//       isPublished,
//       tags,
//       dimensions,
//       weight,
//       sku,
//     });
//     const createdProduct = await product.save();
//     res.status(201).json(createdProduct); // ✅ Send success response
//   })
// );

// // @route PUT /api/products/:id
// // @desc Update an existing product ID
// // @access Private/Admin
// router.put(
//   "/:id",
//   protect,
//   admin,
//   asyncHandler(async (req, res) => {
//     const {
//       name,
//       description,
//       price,
//       discountPrice,
//       countInStock,
//       category,
//       brand,
//       sizes,
//       colors,
//       collections,
//       material,
//       gender,
//       images,
//       isFeatured,
//       isPublished,
//       tags,
//       dimensions,
//       weight,
//       sku,
//     } = req.body;

//     // Find product by ID
//     const product = await Product.findById(req.params.id);

//     if (product) {
//       // Update product fields
//       product.name = name || product.name;
//       product.description = description || product.description;
//       product.price = price ?? product.price; // "??" is used to preserve 0 if price is set to 0; fallback only if undefined or null
//       product.discountPrice = discountPrice ?? product.discountPrice;
//       product.countInStock = countInStock ?? product.countInStock;
//       product.category = category || product.category;
//       product.brand = brand || product.brand;
//       product.sizes = sizes || product.sizes;
//       product.colors = colors || product.colors;
//       product.collections = collections || product.collections;
//       product.material = material || product.material;
//       product.gender = gender || product.gender;
//       product.images = images || product.images;
//       product.isFeatured = isFeatured ?? product.isFeatured; // "??" is used to preserve false  if price is set to false ; fallback only if undefined or null
//       product.isPublished = isPublished ?? product.isPublished;
//       product.tags = tags || product.tags;
//       product.dimensions = dimensions || product.dimensions;
//       product.weight = weight ?? product.weight;
//       product.sku = sku || product.sku;

//       const updatedProduct = await product.save();
//       res.status(200).json(updatedProduct);
//     } else {
//       res.status(404);
//       throw new Error("Product not found");
//     }
//   })
// );

// // @route DELETE /api/products/:id
// // @desc Delete a product by ID
// // @access Private/Admin
// router.delete(
//   "/:id",
//   protect,
//   admin,
//   asyncHandler(async (req, res) => {
//     // Find the product by ID
//     const product = await Product.findById(req.params.id);

//     if (product) {
//       // Remove the product from DB
//       await product.deleteOne();
//       res.status(200).json({ message: "Product removed successfully" });
//     } else {
//       res.status(404);
//       throw new Error("Product not found");
//     }
//   })
// );

// @route GET /api/products?
// @desc Get all products with optional query filter
// @access Public
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const {
      collection,
      size,
      color,
      gender,
      minPrice,
      maxPrice,
      sortBy,
      search,
      category,
      material,
      brand,
      pageNumber,
      // limit,
    } = req.query;

    let query = {}; // for searching .find() query

    // Exact match filters
    if (collection && collection.toLowerCase() !== "all") {
      query.collections = collection;
    }
    if (category && category.toLowerCase() !== "all") {
      query.category = { $regex: `^${category.trim()}`, $options: "i" }; // ensure exact match (e.g. "T-Shirts" only matches "T-Shirts", not "Casual T-Shirts")
    }
    if (gender) {
      query.gender = gender;
    }

    // Array filters
    if (material) {
      query.material = { $in: material.split(",") };
    }

    // console.log(query.material);

    if (brand) {
      query.brand = { $in: brand.split(",") };
    }
    if (size) {
      query.sizes = { $in: size.split(",") };
    }

    if (color) {
      query["colors.name"] = { $in: color.split(",") }; // Remember edit this
    }

    // Price Range
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) query.price.$lte = Number(maxPrice);
    }

    // console.log(query.price);

    // Text search
    const trimmedSearch = search?.trim();
    if (trimmedSearch) {
      query.$or = [
        { name: { $regex: trimmedSearch, $options: "i" } },
        { description: { $regex: trimmedSearch, $options: "i" } },
      ];
    }

    // Sorting
    let sort = {}; // for sorting .sort()
    if (sortBy === "high-low") sort.price = -1;
    else if (sortBy === "low-high") sort = { price: 1 };
    else if (sortBy === "popularity") sort = { rating: -1 };
    else sort = { createdAt: -1 };

    const currentPage = Number(pageNumber) || 1;
    const pageSize = Number(process.env.PAGINATION_LIMIT) || 20;
    const skip = (currentPage - 1) * pageSize;

    const totalCount = await Product.countDocuments(query);
    const products = await Product.find(query).sort(sort);
    // .skip(skip)
    // .limit(pageSize);

    res.status(200).json({
      products,
      currentPage,
      totalPages: Math.ceil(totalCount / pageSize),
      totalProducts: totalCount,
    });
  })
);

// @route GET /api/products/top-collection
// @desc Get top collection products by gender
// @access Public
router.get(
  "/top-collection",
  asyncHandler(async (req, res) => {
    const { gender, limit = 8 } = req.query;

    const topProducts = await Product.find({ gender })
      .sort({ rating: -1 }) // or .sort({ rating: -1 }) if based on popularity
      .limit(Number(limit));

    if (!topProducts || topProducts.length === 0) {
      res.status(404);
      throw new Error("No products found for the specified gender");
    }

    res.status(200).json(topProducts);
  })
);

// @route GET /api/products/new-arrivals
// @desc Retrieve latest 8 products – based on creation date
// @access Public
router.get(
  "/new-arrivals",
  asyncHandler(async (req, res) => {
    const newArrivals = await Product.find().sort({ createdAt: -1 }).limit(8);

    res.status(200).json(newArrivals);
  })
);

// @route GET/ api/products/best-seller
// @desc Retrieve the product with highest rating
// @access Public
router.get(
  "/best-seller",
  asyncHandler(async (req, res) => {
    const bestSeller = await Product.findOne().sort({ rating: -1 });

    if (bestSeller) {
      res.status(200).json(bestSeller);
    } else {
      res.status(400);
      throw new Error("No best seller found");
    }
  })
);

// @route GET /api/products/:id
// @desc Get a single product details by ID
// @access Public
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404);
      throw new Error("Product Not Found");
    }
  })
);

// @route   POST /api/products/:id/reviews
// @desc    Create a new review (only if the user has purchased the product)
// @access  Private
router.post(
  "/:id/reviews",
  protect,
  asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;
    const productId = req.params.id;

    // Find the product by ID
    const product = await Product.findById(productId);

    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    // Check if the user has purchased the product
    const order = await Order.findOne({
      userId: req.user._id,
      "cartItems.productId": productId,
      orderStatus: "confirmed",
    });

    if (!order) {
      return res.status(403).json({
        success: false,
        message: "You need to purchase the product to review it",
      });
    }

    // Check if the user has already reviewed the product
    const alreadyReviewed = product.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("You already reviewed this product");
    }

    // Create a new review
    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    // Add the review to the product
    product.reviews.push(review);

    // Update the product's rating and number of reviews
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, review) => acc + review.rating, 0) /
      product.reviews.length;

    await product.save();

    res.status(201).json({ message: "Review added successfully" });
  })
);

// @route GET/api/products/similar/:id
// @desc Retreive similar products based on the current product's gender and category
// @access Public
router.get(
  "/similar/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      res.status(404);
      throw new Error("Product Not Found");
    }

    const similarProducts = await Product.find({
      _id: { $ne: id }, // Exclude the current product ID
      gender: product.gender,
      category: product.category,
    }).limit(5);

    res.status(200).json(similarProducts);
  })
);

export default router;
