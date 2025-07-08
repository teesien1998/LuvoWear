import { apiSlice } from "./apiSlice";

export const adminApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchUsers: builder.query({
      query: () => ({
        url: "/api/admin/users",
      }),
      providesTags: ["AdminUsers"],
    }),
    addUser: builder.mutation({
      query: (userData) => ({
        url: "/api/admin/users",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["AdminUsers"],
    }),
    updateUser: builder.mutation({
      query: ({ userId, userData }) => ({
        url: `/api/admin/users/${userId}`,
        method: "PUT",
        body: userData,
      }),
      invalidatesTags: ["AdminUsers"],
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `/api/admin/users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AdminUsers"],
    }),
  }),
});

export const {
  useFetchUsersQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = adminApiSlice;
