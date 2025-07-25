"use client";

import { getClientCookie, parse_json_string, setClientCookie } from "@/helpers/client/client_function";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const isBrowser = typeof window !== "undefined";

interface UserState {
  token: string | null;
  user: Record<string, unknown> | null;
}

const getInitialState = (): UserState => {
  if (!isBrowser) {
    return {
      token: null,
      user: null,
    };
  }
  return {
    token: getClientCookie("token"),
    user: parse_json_string("user"),
  };
};

const initialState: UserState = getInitialState();

const days_15_in_minutes = 60 * 24 * 15;

const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ token: string; user: Record<string, unknown> }>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;

      if (isBrowser) {
        setClientCookie("token", action.payload.token, days_15_in_minutes);
        setClientCookie("user", encodeURIComponent(JSON.stringify(action.payload.user)), days_15_in_minutes);
      }
    },
    logout: (state) => {
      state.token = null;
      state.user = null;

      if (isBrowser) {
        setClientCookie("user", "", 0);
        setClientCookie("token", "", 0);
      }
    },
  },
});

export const { login, logout } = UserSlice.actions;

export default UserSlice.reducer;
