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
  }),
});

export const {
  useLoginMutation,
  useAddCategoryMutation,
  useAllCategoriesQuery,
} = userSlice;
