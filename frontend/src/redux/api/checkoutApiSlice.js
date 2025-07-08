import { apiSlice } from "./apiSlice";

export const checkoutApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCheckout: builder.mutation({
      query: (data) => ({
        url: "/api/checkout",
        method: "POST",
        body: data,
      }),
    }),
    payCheckout: builder.mutation({
      query: ({ id, paymentData }) => ({
        url: `/api/checkout/${id}/pay`,
        method: "PUT",
        body: paymentData,
      }),
    }),
    finalizeCheckout: builder.mutation({
      query: (id) => ({
        url: `/api/checkout/${id}/finalize`,
        method: "PUT",
      }),
    }),
  }),
});

export const {
  useCreateCheckoutMutation,
  usePayCheckoutMutation,
  useFinalizeCheckoutMutation,
} = checkoutApiSlice;
