import { apiSlice } from "./apiSlice";

export const adminOrderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchAllOrders: builder.query({
      query: () => ({
        url: "/api/admin/orders",
      }),
      providesTags: ["AdminOrders"],
    }),
    updateOrderStatus: builder.mutation({
      query: ({ orderId, status }) => ({
        url: `/api/admin/orders/${orderId}`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["AdminOrders"],
    }),
    deleteOrder: builder.mutation({
      query: (orderId) => ({
        url: `/api/admin/orders/${orderId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AdminOrders"],
    }),
  }),
});

export const {
  useFetchAllOrdersQuery,
  useUpdateOrderStatusMutation,
  useDeleteOrderMutation,
} = adminOrderApiSlice;
