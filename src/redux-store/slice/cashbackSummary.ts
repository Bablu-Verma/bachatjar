"use client";

import { parse_json_string, setClientCookie } from "@/helpers/client/client_function";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const isBrowser = typeof window !== "undefined";

interface CashbackSummaryState {
  summary: {
    total_cb: number;
    total_hold: number;
    total_withdrawal: number;
    withdrawal_pending: number;
    conform_cb:number
  } | null;
}

const getInitialState = (): CashbackSummaryState => {
  if (!isBrowser) {
    return {
      summary: null,
    };
  }
  return {
    summary: parse_json_string("cashback_summary"),
  };
};

const initialState: CashbackSummaryState = getInitialState();

const CashbackSummarySlice = createSlice({
  name: "cashbackSummary",
  initialState,
  reducers: {
    setSummary: (state, action: PayloadAction<{ summary: CashbackSummaryState["summary"] }>) => {
      state.summary = action.payload.summary;

      if (isBrowser && action.payload.summary) {
        setClientCookie("cashback_summary", encodeURIComponent(JSON.stringify(action.payload.summary)), 30);
      }
    },
    clearSummary: (state) => {
      state.summary = null;
      if (isBrowser) {
        setClientCookie("cashback_summary", "", -1); 
      }
    }
  },
});

export const { setSummary, clearSummary } = CashbackSummarySlice.actions;

export default CashbackSummarySlice.reducer;
