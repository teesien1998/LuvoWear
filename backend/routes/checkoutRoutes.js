import express from "express";
import Checkout from "../models/Checkout.js";
import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { protect } from "../middleware/authMiddleware.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { inngest } from "../inngest/index.js"; // Import Inngest client and functions

const router = express.Router();

// @route POST /api/checkout
// @desc Create a new checkout session
// @access Private
router.post(
  "/",
  protect,
  asyncHandler(async (req, res) => {
    const { checkoutItems, shippingAddress, paymentMethod, totalPrice } =
      req.body;

    console.log("CheckoutItems", checkoutItems);

    if (!checkoutItems || checkoutItems.length === 0) {
      res.status(400);
      throw new Error("No items in checkout");
    }

    const newCheckout = await Checkout.create({
      user: req.user._id,
      checkoutItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      paymentStatus: "Pending",
      isPaid: false,
    });

    res.status(201).json(newCheckout);
  })
);

// @route   PUT /api/checkout/:id/pay
// @desc    Update checkout to mark as paid after successful payment
// @access  Private
router.put(
  "/:id/pay",
  protect,
  asyncHandler(async (req, res) => {
    const { paymentStatus, paymentDetails } = req.body;

    const checkout = await Checkout.findById(req.params.id);

    if (!checkout) {
      return res.status(404).json({ message: "Checkout not found" });
    }

    if (paymentStatus === "Paid") {
      checkout.isPaid = true;
      checkout.paymentStatus = paymentStatus;
      checkout.paymentDetails = paymentDetails;
      checkout.paidAt = Date.now();

      await checkout.save();

      res.status(200).json(checkout);
    } else {
      res.status(400).json({ message: "Invalid Payment Status" });
    }
  })
);

// @route PUT /api/checkout/:id/finalize
// @desc Finalize checkout and convert to an order after payment confirmation
// @access Private
router.put(
  "/:id/finalize",
  protect,
  asyncHandler(async (req, res) => {
    const checkout = await Checkout.findById(req.params.id);

    if (!checkout) {
      res.status(404);
      throw new Error("Checkout not found ");
    }

    if (checkout.isPaid && !checkout.isFinalized) {
      // Create final order based on the checkout details
      const finalOrder = await Order.create({
        user: checkout.user,
        orderItems: checkout.checkoutItems,
        shippingAddress: checkout.shippingAddress,
        paymentMethod: checkout.paymentMethod,
        totalPrice: checkout.totalPrice,
        isPaid: true,
        paidAt: checkout.paidAt,
        paymentStatus: "Paid",
        paymentDetails: checkout.paymentDetails,
        isDelivered: false,
      });

      // Update the totalSold field for each product
      for (const item of checkout.checkoutItems) {
        const product = await Product.findById(item.productId); // Changed from item.product to item.productId
        if (product) {
          product.totalSold += item.quantity; // Changed from item.qty to item.quantity
          await product.save();
        }
      }

      console.log("FinalOrder", finalOrder);

      await inngest.send({
        name: "order/created",
        data: { orderId: finalOrder._id },
      });

      // Mark the checkout as finalized
      checkout.isFinalized = true;
      checkout.finalizedAt = Date.now();
      await checkout.save();

      // Delete the cart associated with the user
      await Cart.findOneAndDelete({ user: checkout.user });

      res.status(201).json(finalOrder);
    } else if (checkout.isFinalized) {
      res.status(400);
      throw new Error("Checkout already finalized");
    } else {
      res.status(400);
      throw new Error("Checkout is not paid");
    }
  })
);

export default router;
