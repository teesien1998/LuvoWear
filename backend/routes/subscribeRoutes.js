import express from "express";
import Subscriber from "../models/Subscriber.js";
import asyncHandler from "../middleware/asyncHandler.js";

const router = express.Router();

// @route POST /api/subscribe
// @desc hadle newsletter subscription
// @access Public
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) {
      res.status(400);
      throw new Error("Email is required");
    }

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValidEmail) {
      res.status(400);
      throw new Error("Invalid email format");
    }

    // Check if the email is already subscribed
    let existSubscriber = await Subscriber.findOne({ email });

    if (existSubscriber) {
      res.status(400);
      throw new Error("Email is already subscribed");
    }

    // Create a new subscriber
    const subscriber = await Subscriber.create({ email });

    res
      .status(201)
      .json({ message: "Successfully subscribed to the newsletter!" });
  })
);

export default router;
