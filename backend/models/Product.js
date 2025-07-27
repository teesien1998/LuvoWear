import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const productSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discountPrice: {
      type: Number,
      default: null,
    },
    totalSold: {
      type: Number,
      default: 0,
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },
    sku: {
      type: String,
      unique: true,
    },
    category: {
      type: String,
      enum: [
        "T-Shirts",
        "Shirts",
        "Sweatshirts",
        "Hoodies",
        "Outerwear",
        "Bottoms",
        "Activewear",
        "Accessories",
        "Footwear",
      ],
      required: true,
      trim: true,
    },
    brand: {
      type: String,
      trim: true,
    },
    sizes: {
      type: [String],
      required: true,
      default: [],
    },
    colors: {
      type: [
        {
          name: String,
          hex: String,
          _id: false, // Edited, Different with default one
        },
      ],
      required: true,
      default: [],
    },
    collections: {
      type: String,
      trim: true,
    },
    material: {
      type: String,
      enum: [
        "Cotton",
        "Denim",
        "Polyester",
        "Wool",
        "Linen",
        "Silk",
        "Fleece",
        "Nylon",
        "Viscose",
        "Leather",
      ],
      required: true,
      trim: true,
    },
    gender: {
      type: String,
      enum: ["Men", "Women", "Unisex", "Kids"],
    },
    images: {
      type: [
        {
          url: {
            type: String,
            required: true,
          },
          public_id: {
            type: String,
            required: true,
          },
          altText: {
            type: String,
            trim: true,
          },
        },
      ],
      default: [],
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    reviews: [reviewSchema],
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    tags: {
      type: [String],
      default: [],
    },
    metaTitle: {
      type: String,
      trim: true,
    },
    metaDescription: {
      type: String,
      trim: true,
    },
    metaKeywords: {
      type: String,
      trim: true,
    },
    // dimensions: {
    //   length: { type: Number, default: 0 },
    //   width: { type: Number, default: 0 },
    //   height: { type: Number, default: 0 },
    // },
    // weight: {
    //   type: Number,
    //   default: 0,
    // },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
