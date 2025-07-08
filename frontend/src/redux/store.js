import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";
import authSliceReducer from "./slices/authSlice"; // ✅ Make sure the path is correct and this is exported properly
import filterSliceReducer from "./slices/filterSlice";
import cartSliceReducer from "./slices/cartSlice";
import checkoutSliceReducer from "./slices/checkoutSlice";

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authSliceReducer,
    filters: filterSliceReducer,
    cart: cartSliceReducer,
    checkout: checkoutSliceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export default store;
