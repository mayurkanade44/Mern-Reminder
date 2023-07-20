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
    logout: builder.mutation({
      query: () => ({
        url: "/api/user/logout",
        method: "POST",
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: "/api/user/register",
        method: "POST",
        body: data,
      }),
    }),
    approveUser: builder.mutation({
      query: (data) => ({
        url: "/api/user/register",
        method: "PATCH",
        body: data,
      }),
    }),
    updateUser: builder.mutation({
      query: (data) => ({
        url: "/api/user/updateUser",
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
  useApproveUserMutation,
  useAddCategoryMutation,
  useAllCategoriesQuery,
  useAllUsersQuery,
  useLogoutMutation,
} = userSlice;
