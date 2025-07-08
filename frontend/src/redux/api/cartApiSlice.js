import { apiSlice } from "./apiSlice";

export const cartApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchCart: builder.query({
      query: ({ userId, guestId }) => ({
        url: "/api/cart",
        params: {
          userId,
          guestId,
        },
      }),
      providesTags: ["Cart"], // 👈 tag provided
    }),
    addToCart: builder.mutation({
      query: (data) => ({
        url: "/api/cart",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Cart"], // 👈 tag invalidated
    }),
    updateCartItem: builder.mutation({
      query: (data) => ({
        url: "/api/cart",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Cart"],
    }),
    removeFromCart: builder.mutation({
      query: (data) => ({
        url: "/api/cart",
        method: "DELETE",
        body: data,
      }),
      invalidatesTags: ["Cart"],
    }),
    mergeGuestCart: builder.mutation({
      query: (guestId) => ({
        url: "/api/cart/merge",
        method: "POST",
        body: { guestId },
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useFetchCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useMergeGuestCartMutation,
} = cartApiSlice;
