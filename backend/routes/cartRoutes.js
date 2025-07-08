import express from "express";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import { protect } from "../middleware/authMiddleware.js";
import asyncHandler from "../middleware/asyncHandler.js";

const router = express.Router();

const roundToTwo = (num) => Math.round(num * 100) / 100;

// Helper function to get a cart by user ID or guest ID
const getCart = async (userId, guestId) => {
  if (userId) {
    return await Cart.findOne({ user: userId });
  } else if (guestId) {
    return await Cart.findOne({ guestId });
  }
  return null;
};

// @route GET /api/cart?userId=
// @desc Get logged-in user's or guest user's cart
// @access Public
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { userId, guestId } = req.query;
    const cart = await getCart(userId, guestId);

    if (cart) {
      res.status(200).json(cart);
    } else {
      res.status(404);
      throw new Error("Cart not found");
    }
  })
);

// @route POST /api/cart
// @desc Add a product to the cart for a guest or logged in user
// @access Public
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { productId, quantity, size, color, guestId, userId } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      res.status(404);
      throw new Error("Product Not Found");
    }

    // Determine if the user is logged in or guest
    let cart = await getCart(userId, guestId);

    // If the cart exists, update it, if no cart exists, create new cart
    if (cart) {
      const existingProduct = cart.products.find(
        // .find() return the reference value which can modify directly
        (p) =>
          p.productId.toString() === productId &&
          p.size === size &&
          p.color.name === color.name
      );

      if (existingProduct) {
        // If the product already exists in the cart, update the quantity
        existingProduct.quantity += quantity;
      } else {
        // else if the cart dont the product, then just add new product into the cart
        cart.products.push({
          productId,
          name: product.name,
          image: product.images[0].url,
          price: product.price,
          size,
          color,
          quantity,
        });
      }

      // Recalculate the total price
      cart.totalPrice = roundToTwo(
        cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0)
      );

      await cart.save();
      res.status(200).json(cart);
    } else {
      // else if no cart found, create new cart with the newly added product
      const newCart = await Cart.create({
        user: userId ? userId : undefined,
        guestId: guestId ? guestId : "guest_" + new Date().getTime(), // NEED TO EDIT THIS
        products: [
          {
            productId,
            name: product.name,
            image: product.images[0].url,
            price: product.price,
            size,
            color,
            quantity,
          },
        ],
        totalPrice: roundToTwo(product.price * quantity),
      });

      res.status(201).json(newCart);
    }
  })
);

// @route PUT /api/cart
// @desc Update product quantity in the cart for a guest ot logged-in user
// @access Public
router.put(
  "/",
  asyncHandler(async (req, res) => {
    const { productId, quantity, size, color, guestId, userId } = req.body;

    // Determine if the user is logged in or guest
    let cart = await getCart(userId, guestId);

    console.log(cart);

    if (!cart) {
      res.status(404);
      throw new Error("Cart Not Found");
    }

    const existingProduct = cart.products.find(
      (p) =>
        p.productId.toString() === productId &&
        p.size === size &&
        p.color.name === color.name
    );

    if (existingProduct) {
      // If the product exists, update the quantity
      if (quantity > 0) {
        existingProduct.quantity = quantity;
      } else {
        // Remove product if quantity is 0
        cart.products = cart.products.filter(
          (p) =>
            !(
              p.productId.toString() === productId &&
              p.size === size &&
              p.color.name === color.name
            )
        );
      }
      cart.totalPrice = roundToTwo(
        cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0)
      );

      await cart.save();
      res.status(200).json(cart);
    } else {
      res.status(404);
      throw new Error("Product not found in the cart");
    }
  })
);

// @route DELETE /api/cart
// @desc Remove a product from the cart
// @access Public
router.delete(
  "/",
  asyncHandler(async (req, res) => {
    const { productId, size, color, guestId, userId } = req.body;

    // Determine if the user is logged in or guest
    let cart = await getCart(userId, guestId);

    if (!cart) {
      res.status(404);
      throw new Error("Cart not found");
    }

    const productIndex = cart.products.findIndex(
      (p) =>
        p.productId.toString() === productId &&
        p.size === size &&
        p.color.name === color.name
    );

    if (productIndex > -1) {
      cart.products.splice(productIndex, 1); // Remove product with return productIndex

      cart.totalPrice = roundToTwo(
        cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0)
      );

      await cart.save();
      res.status(200).json(cart);
    } else {
      res.status(404);
      throw new Error("Product not found in cart");
    }
  })
);

// @route POST /api/cart/merge
// @desc Merge guest cart into user cart on login
// @access Private
router.post(
  "/merge",
  protect,
  asyncHandler(async (req, res) => {
    const { guestId } = req.body;
    const userId = req.user._id;

    if (!userId || !guestId) {
      res.status(400);
      throw new Error("userId and guestId are required for merging");
    }

    const guestCart = await Cart.findOne({ guestId });
    const userCart = await Cart.findOne({ user: userId });

    console.log(userCart);
    console.log(guestCart);

    if (guestCart) {
      if (guestCart.products.length === 0) {
        res.status(400);
        throw new Error("Guest cart is empty");
      }

      if (userCart) {
        // Merge guest cart into user cart
        guestCart.products.forEach((guestItem) => {
          const productIndex = userCart.products.findIndex(
            (item) =>
              item.productId.toString() === guestItem.productId.toString() &&
              item.size === guestItem.size &&
              item.color === guestItem.color
          );

          if (productIndex > -1) {
            // If the items exist in the user cart, update the quantity
            userCart.products[productIndex].quantity += guestItem.quantity;
          } else {
            // otherwise, add the guest item to the cart
            userCart.products.push(guestItem);
          }
        });

        userCart.totalPrice = roundToTwo(
          userCart.products.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
          )
        );

        await userCart.save();
        // Remove the guest cart after merging
        await guestCart.deleteOne();
        // await Cart.findOneAndDelete({ guestId });

        res.status(200).json(userCart);
      } else {
        // If the user has no existing cart, assign the guest cart to the user
        guestCart.user = req.user._id;
        guestCart.guestId = undefined;
        await guestCart.save();

        res.status(200).json(guestCart);
      }
    } else {
      // No Guest cart to merged, just return user chart
      if (userCart) {
        console.log(userCart);
        return res.status(200).json(userCart);
      }
      res.status(404);
      throw new Error("Guest cart not found");
    }
  })
);

export default router;
