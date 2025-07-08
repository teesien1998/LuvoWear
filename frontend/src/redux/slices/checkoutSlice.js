import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  checkout: localStorage.getItem("checkout") // Load from localStorage if available
    ? JSON.parse(localStorage.getItem("checkout"))
    : null,
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    setCheckout: (state, action) => {
      state.checkout = action.payload;
      localStorage.setItem("checkout", JSON.stringify(action.payload)); // sync to localStorage
    },
    clearCheckoutState: (state) => {
      state.checkout = null;
      localStorage.removeItem("checkout"); // remove from localStorage
    },
  },
});

export const { setCheckout, clearCheckoutState } = checkoutSlice.actions;
export default checkoutSlice.reducer;
