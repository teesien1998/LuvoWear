import express from "express";
import User from "../models/User.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// @route GET /api/admin/users
// @desc Get all users (Admin only)
// @access Private/Admin
router.get(
  "/",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const users = await User.find({}).select("-password");
    res.json(users);
  })
);

// @route  POST /api/admin/users
// @desc Add a new user (admin only)
// @access Private/Admin
router.post(
  "/",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;

    let existUser = await User.findOne({ email });

    if (existUser) {
      res.status(400);
      throw new Error("User already exists ");
    }

    const user = new User({
      name,
      email,
      password,
      role: role || "customer",
    });

    await user.save();
    res.status(201).json({
      message: "User created successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  })
);

// @route PUT /api/admin/users/:id
// @desc Update user info (admin only) - Name, email and role
// @access Private/Admin
router.put(
  "/:id",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });

      if (emailExists && emailExists._id.toString() !== user._id.toString()) {
        res.status(400);
        throw new Error("Email already in use by another user");
      }
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.password = password || user.password; // Password can be updated, but not required
    user.role = role || user.role;

    await user.save();

    res.status(200).json({
      message: "User updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  })
);

// @route DELETE /api/admin/users/:id
// @desc Delete a user
// @access Private Admin
router.delete(
  "/:id",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    await user.deleteOne();
    res.status(200).json({ message: "User deleted successfully" });
  })
);

export default router;
