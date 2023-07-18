import { apiSlice } from "./apiSlice";

export const reminderSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    newReminder: builder.mutation({
      query: (data) => ({
        url: "/api/reminder/add-update",
        method: "POST",
        body: data,
      }),
    }),
    allReminders: builder.query({
      query: ({ search, category, page }) => ({
        url: "/api/reminder/allReminders",
        params: { search, category, page },
      }),
      keepUnusedDataFor: 5,
      providesTags: ["Reminders"],
    }),
    singleReminder: builder.query({
      query: (id) => ({
        url: `/api/reminder/singleReminder/${id}`,
      }),
      providesTags: ["Reminder"],
    }),
    updateReminder: builder.mutation({
      query: ({ data, id }) => ({
        url: `/api/reminder/singleReminder/${id}`,
        method: "PATCH",
        body: data,
      }),
    }),
    deleteReminder: builder.mutation({
      query: (id) => ({
        url: `/api/reminder/singleReminder/${id}`,
        method: "DELETE",
      }),
    }),
    reminderStats: builder.query({
      query: () => ({
        url: "/api/reminder/reminderStats",
      }),
      keepUnusedDataFor: 5,
      providesTags: ["Reminders"],
    }),
  }),
});

export const {
  useNewReminderMutation,
  useAllRemindersQuery,
  useSingleReminderQuery,
  useUpdateReminderMutation,
  useDeleteReminderMutation,
  useReminderStatsQuery,
} = reminderSlice;
