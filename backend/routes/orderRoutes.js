import express from "express";
import Order from "../models/Order.js";
import { protect } from "../middleware/authMiddleware.js";
import asyncHandler from "../middleware/asyncHandler.js";

const router = express.Router();

// @route GET /api/orders/my-orders
// @desc Get logged-ing user's orders
// @access Private
router.get(
  "/my-orders",
  protect,
  asyncHandler(async (req, res) => {
    //Find orders for the authenticated users
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json(orders);
  })
);

// @route GET /api/orders/:id
// @desc Get order details by ID
// @access Private
router.get(
  "/:id",
  protect,
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate("user", "email");

    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    // Mongoose ObjectIds are objects (not strings), have to convert the user._id to String
    if (order.user._id.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Not authorized to access this order");
    }

    res.status(200).json(order);
  })
);

export default router;
