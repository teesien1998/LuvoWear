import { createSlice } from "@reduxjs/toolkit";

// Helper function to load cart from localStorage
const loadCartfromStorage = () => {
  const storedCart = localStorage.getItem("cart");
  return storedCart ? JSON.parse(storedCart) : { products: [], totalPrice: 0 };
};

// // Helper function to save cart to localStorage
// const saveCartToStorage = (cart) => {
//   localStorage.setItem("cart", JSON.stringify(cart));
// };

const initialState = {
  cart: loadCartfromStorage(),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action) => {
      state.cart = action.payload;
      // console.log(state.cart);
      localStorage.setItem("cart", JSON.stringify(action.payload));
    },
    clearCart: (state) => {
      state.cart = { products: [], totalPrice: 0 };
      localStorage.removeItem("cart");
    },
  },
});

export const { setCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
