import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import asyncHandler from "../middleware/asyncHandler.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

const generateToken = (res, userId) => {
  // Return the token through JWT Sign
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  // Determine secure & sameSite based on environment
  const isProduction = process.env.NODE_ENV === "production";
  const isSecure = isProduction && process.env.COOKIE_SECURE === "true";

  console.log(`isSecure: ${isSecure}`);

  // Set JWT as HTTP-Only Cookie
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: isSecure,
    sameSite: isSecure ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

// @route POST /api/users/register
// @desc Register a new user
// @access Public
router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    // Try to create the user
    const user = await User.create({ name, email, password });

    if (!user) {
      res.status(500);
      throw new Error("Failed to create user");
    }

    generateToken(res, user._id);
    // // Create JWT Payload
    // const payload = { userId: user._id, role: user.role };
    // // Return the token through JWT Sign
    // const token = jwt.sign(payload, process.env.JWT_SECRET, {
    //   expiresIn: "5d",
    // });

    // Respond with user data and token
    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  })
);

// @route POST /api/users/login
// @desc Authenticate user
// @access Public
router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      res.status(401);
      throw new Error("Invalid email or password");
    }

    generateToken(res, user._id);
    // // Create JWT Payload
    // const payload = { userId: user._id, role: user.role };
    // // Return the token through JWT Sign
    // const token = jwt.sign(payload, process.env.JWT_SECRET, {
    //   expiresIn: "40h",
    // });

    // Send the user data and token in response
    res.status(201).json({
      message: "Log in successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  })
);

// @route POST /api/users/logout
// @desc Authenticate user
// @access Public
router.post(
  "/logout",
  asyncHandler(async (req, res) => {
    // Determine secure & sameSite based on environment
    const isProduction = process.env.NODE_ENV === "production";
    const isSecure = isProduction && process.env.COOKIE_SECURE === "true";

    res.clearCookie("jwt", {
      httpOnly: true,
      secure: isSecure,
      sameSite: isSecure ? "none" : "lax",
    });
    res.status(200).json({ message: "Logged out successfully" });
  })
);

// @route   GET/api/users/profile
// @desc    Get logged-in user's profile (Protected route)
// @access  Private
router.get(
  "/profile",
  protect,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    res.json(req.user);
  })
);

export default router;
