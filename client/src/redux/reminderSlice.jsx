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
  }),
});

export const { useNewReminderMutation } = reminderSlice;
