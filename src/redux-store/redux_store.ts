"use client";

import userSlice from './slice/userSlice'
import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";


import wishlistReduce from './slice/wishlistSlice'
import CashbackSummarySlice from './slice/cashbackSummary'

const store_ = configureStore({
  reducer: {
    user: userSlice,
    cashbackSummary:CashbackSummarySlice,
    wishlist: wishlistReduce,
  },
});



export type RootState = ReturnType<typeof store_.getState>
export type AppDispatch = typeof store_.dispatch


export const useAppDispatch = () => useDispatch<AppDispatch>() 
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector 


export default store_
