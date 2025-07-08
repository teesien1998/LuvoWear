import { apiSlice } from "./apiSlice";

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchUserOrders: builder.query({
      query: () => ({
        url: `/api/orders/my-orders`,
      }),
    }),
    fetchOrderDetails: builder.query({
      query: (orderId) => ({
        url: `/api/orders/${orderId}`,
      }),
    }),
  }),
});

export const { useFetchUserOrdersQuery, useFetchOrderDetailsQuery } =
  orderApiSlice;
