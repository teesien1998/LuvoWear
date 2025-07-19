import express from "express";
import Order from "../models/Order.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// @route GET /api/admin/orders
// @desc Get all orders (Admin only)
// @access Private/Admin
router.get(
  "/",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const orders = await Order.find({})
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    const totalOrders = orders.length;
    const totalSales = orders.reduce((sum, order) => sum + order.totalPrice, 0);

    console.log(`Total Orders: ${totalOrders}`);
    res.status(200).json({ orders, totalOrders, totalSales });
  })
);

// @route PUT /api/admin/orders/:id
// @desc Update order status
// @access Private/Admin
router.put(
  "/:id",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    order.status = status || order.status;
    order.isDelivered = status === "Delivered" ? true : false;
    order.deliveredAt = status === "Delivered" ? Date.now() : order.deliveredAt;
    const updatedOrder = await order.save();

    if (status === "Delivered") {
      await inngest.send({
        name: "order/delivered",
        data: {
          orderId: updatedOrder._id,
        },
      });
    }

    res.status(200).json(updatedOrder);
  })
);

// @route DELETE /api/admin/orders/:id
// @desc  Delete an order
// @access Private/Admin
router.delete(
  "/:id",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    await order.deleteOne();
    res.status(200).json({ message: "Order removed" });
  })
);

export default router;
