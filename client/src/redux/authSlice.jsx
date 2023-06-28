import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null,
  reminderModal: {
    show: false,
    edit: false,
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, { payload }) => {
      state.user = payload.user;
      localStorage.setItem("user", JSON.stringify(payload.user));
    },
    handleReminder: (state, { payload }) => {
      state.reminderModal = payload;
    },
  },
});

export const { setCredentials, handleReminder } = authSlice.actions;
export default authSlice.reducer;
