import { apiSlice } from "./apiSlice";

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchProductsByFilters: builder.query({
      query: ({
        collection,
        size,
        color,
        gender,
        minPrice,
        maxPrice,
        sortBy,
        search,
        category,
        material,
        brand,
        pageNumber,
        limit,
      }) => {
        const query = new URLSearchParams();

        if (collection) query.append("collection", collection);
        if (size.length > 0) query.append("size", size.join(","));
        if (color.length > 0) query.append("color", color.join(","));
        if (gender) query.append("gender", gender);
        if (minPrice) query.append("minPrice", minPrice);
        if (maxPrice) query.append("maxPrice", maxPrice);
        if (sortBy) query.append("sortBy", sortBy);
        if (search) query.append("search", search);
        if (category) query.append("category", category);
        if (material.length > 0) query.append("material", material.join(","));
        if (brand.length > 0) query.append("brand", brand.join(","));
        if (pageNumber) query.append("pageNumber", pageNumber);
        if (limit) query.append("limit", limit);

        return { url: `/api/products?${query.toString()}` };
      },
    }),
    fetchProductDetails: builder.query({
      query: (productId) => ({
        url: `/api/products/${productId}`,
      }),
    }),
    fetchSimilarProducts: builder.query({
      query: (productId) => ({
        url: `/api/products/similar/${productId}`,
      }),
    }),
    fetchNewArrivals: builder.query({
      query: () => ({
        url: "/api/products/new-arrivals",
      }),
    }),
    fetchBestSeller: builder.query({
      query: () => ({
        url: "/api/products/best-seller",
      }),
    }),
    fetchTopCollection: builder.query({
      query: (data) => ({
        url: "/api/products/top-collection",
        params: data,
      }),
    }),
    createProductReview: builder.mutation({
      query: ({ productId, rating, comment }) => ({
        url: `/api/products/${productId}/reviews`,
        method: "POST",
        body: { rating, comment },
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: "Product", id: productId },
      ],
    }),
  }),
});

export const {
  useFetchProductsByFiltersQuery,
  useFetchProductDetailsQuery,
  useFetchNewArrivalsQuery,
  useFetchBestSellerQuery,
  useFetchSimilarProductsQuery,
  useFetchTopCollectionQuery,
  useCreateProductReviewMutation,
} = productApiSlice;
