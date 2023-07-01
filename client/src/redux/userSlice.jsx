import { apiSlice } from "./apiSlice";

export const userSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: "/api/user/login",
        method: "POST",
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: "/api/user/register",
        method: "POST",
        body: data,
      }),
    }),
    updateUser: builder.mutation({
      query: (data) => ({
        url: "/api/user/register",
        method: "PATCH",
        body: data,
      }),
    }),
    addCategory: builder.mutation({
      query: ({ data, id }) => ({
        url: `/api/user/profile/${id}`,
        method: "PATCH",
        body: data,
      }),
    }),
    allCategories: builder.query({
      query: () => ({
        url: "/api/user/categories",
      }),
      keepUnusedDataFor: 5,
      providesTags: ["User"],
    }),
    allUsers: builder.query({
      query: () => ({
        url: "/api/user/allUsers",
      }),
      keepUnusedDataFor: 5,
      providesTags: ["Users"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useUpdateUserMutation,
  useAddCategoryMutation,
  useAllCategoriesQuery,
  useAllUsersQuery,
} = userSlice;
