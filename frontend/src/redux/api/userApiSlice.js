import { apiSlice } from "./apiSlice";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: (userData) => ({
        url: "/api/users/login",
        method: "POST",
        body: userData,
      }),
    }),
    registerUser: builder.mutation({
      query: (userData) => ({
        url: "/api/users/register",
        method: "POST",
        body: userData,
      }),
    }),
    logoutUser: builder.mutation({
      query: () => ({
        url: "/api/users/logout",
        method: "POST",
      }),
    }),
  }),
});

// export const userApiSlice = createApi({
//   reducerPath: "userApi", // default reducer key, must be unique
//   baseQuery: fetchBaseQuery({
//     baseUrl: "/", // backend base path
//     credentials: "include", // ✅ allows cookie/JWT to be sent
//   }),
//   endpoints: (builder) => ({
//     loginUser: builder.mutation({
//       query: (userData) => ({
//         url: "/api/users/login",
//         method: "POST",
//         body: userData,
//       }),
//     }),
//     registerUser: builder.mutation({
//       query: (userData) => ({
//         url: "/api/users/register",
//         method: "POST",
//         body: userData,
//       }),
//     }),
//   }),
// });

export const {
  useLoginUserMutation,
  useRegisterUserMutation,
  useLogoutUserMutation,
} = userApiSlice;
