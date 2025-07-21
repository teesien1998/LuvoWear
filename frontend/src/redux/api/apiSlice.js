import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
console.log("Base URL:", baseUrl);
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl,
    mode: "cors",
    credentials: "include",
  }),
  tagTypes: [
    "Cart",
    "Product",
    "User",
    "AdminUsers",
    "AdminProducts",
    "AdminOrders",
    "Checkout",
    "Order",
  ],
  endpoints: () => ({}),
});
