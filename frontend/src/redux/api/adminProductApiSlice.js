import { apiSlice } from "./apiSlice";

export const adminProductApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchAdminProducts: builder.query({
      query: () => ({
        url: "/api/admin/products",
      }),
      providesTags: ["AdminProducts"], // Provides 'Product' tag for caching and automatic refetching
    }),
    createProduct: builder.mutation({
      query: (productData) => ({
        url: "/api/admin/products",
        method: "POST",
        body: productData,
      }),
      invalidatesTags: ["AdminProducts"],
    }),
    updateProduct: builder.mutation({
      query: ({ productId, productData }) => ({
        url: `/api/admin/products/${productId}`,
        method: "PUT",
        body: productData,
      }),
      invalidatesTags: ["AdminProducts"],
    }),
    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `/api/admin/products/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AdminProducts"],
    }),
    uploadImages: builder.mutation({
      query: (formData) => ({
        url: "/api/upload",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["AdminProducts"],
    }),
    deleteImages: builder.mutation({
      query: (public_ids) => ({
        url: "/api/upload",
        method: "DELETE",
        body: { public_ids },
      }),
      invalidatesTags: ["AdminProducts"],
    }),
  }),
});

export const {
  useFetchAdminProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUploadImagesMutation,
  useDeleteImagesMutation,
} = adminProductApiSlice;
