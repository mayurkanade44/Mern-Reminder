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
      query: () => ({
        url: "/api/reminder/allReminders",
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
  }),
});

export const {
  useNewReminderMutation,
  useAllRemindersQuery,
  useSingleReminderQuery,
} = reminderSlice;
