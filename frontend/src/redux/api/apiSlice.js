import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api", // shared across all injected endpoints
  baseQuery: fetchBaseQuery({
    baseUrl: "/", // backend base path
    credentials: "include", // 👈  allows cookie/JWT to be sent
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
  endpoints: () => ({}), // initially empty
});
