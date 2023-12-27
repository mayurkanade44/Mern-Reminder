import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { toast } from "react-toastify";
import { logoutUser } from "./authSlice";

const baseQuery = fetchBaseQuery({ baseUrl: "/" });
const authBaseQuery = async (args, api, option) => {
  const res = await baseQuery(args, api, option);
  if (res.error && res.error.status === 401) {
    toast.error("Unauthorized!! logged out");
    api.dispatch(logoutUser());
    return;
  }
  return res;
};

export const apiSlice = createApi({
  baseQuery: authBaseQuery,
  tagTypes: ["User", "Reminder"],
  endpoints: (builder) => ({}),
});
