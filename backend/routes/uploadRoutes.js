import express from "express";
import multer from "multer";
import streamifier from "streamifier";
import { v2 as cloudinary } from "cloudinary";
import { protect, admin } from "../middleware/authMiddleware.js";
import asyncHandler from "../middleware/asyncHandler.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer setup using memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "luvowear" },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );

    // Use streamifier to convert file buffer to stream
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// @route POST /api/upload
// @desc Upload multiple images to Cloudinary
// @access Private/Admin
router.post(
  "/",
  protect,
  admin,
  upload.array("images", 5), // "images" is key in FormData
  asyncHandler(async (req, res) => {
    if (!req.files || req.files.length === 0) {
      res.status(400);
      throw new Error("No image files uploaded");
    }

    // Call the uploadToCloudinary function
    const results = await Promise.all(
      req.files.map((file) => uploadToCloudinary(file.buffer))
    );

    console.log(results);

    res.status(200).json(
      results.map((r, i) => ({
        url: r.secure_url,
        public_id: r.public_id,
        altText: req.files[i].originalname,
      }))
    );
  })
);

// @route DELETE /api/upload
// @desc Delete multiple images from Cloudinary
// @access Private/Admin
router.delete(
  "/",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const { public_ids } = req.body;

    if (!public_ids || public_ids.length === 0) {
      res.status(400);
      throw new Error("No public_ids provided");
    }

    const results = await Promise.all(
      public_ids.map((id) => cloudinary.uploader.destroy(id))
    );

    res.status(200).json({
      message: `Deleted ${public_ids.length} images from Cloudinary`,
      results,
    });
  })
);

export default router;
