"use client";

import { RootState } from "@/redux-store/redux_store";
import { useDispatch, useSelector } from "react-redux";
import { IUser } from "@/common_type";

import Image from "next/image";
import React, { useEffect } from "react";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { user_profile_api } from "@/utils/api_url";
import { setSummary } from "@/redux-store/slice/cashbackSummary";

 interface ICashbackSummary {
  total_cb: number;
  total_hold: number;
  total_withdrawal: number;
  withdrawal_pending: number;
  conform_cb:number
}

const ProfileEdit = () => {
  const token = useSelector((state: RootState) => state.user.token);
  const user = useSelector((state: RootState) => state.user.user) as IUser | null;
  const summary = useSelector((state: RootState) => state.cashbackSummary.summary) as ICashbackSummary | null;

  const dispatch = useDispatch()


    // eslint-disable-next-line react-hooks/exhaustive-deps
    const getCBsummary = async () => {
      try {
        const { data } = await axios.post(
          user_profile_api,
          { },
          {
            headers: {
              "Content-Type": "application/json",
               Authorization: `Bearer ${token}`,
            },
          }
        );

       dispatch(setSummary({ summary: data.summary }));
      } catch (error) {
        if (error instanceof AxiosError) {
          toast.error(error.response?.data?.message || "Error fetching order details");
        } else {
          console.error("Unexpected error:", error);
        }
      }
    };
  
    useEffect(() => {
      getCBsummary();
    }, [getCBsummary]);

  return (
    <div className="p-4">
      {/* Profile Info */}
      <div className="flex items-center gap-4 mb-8">
        {user?.profile ? (
          <Image
            src={user?.profile}
            alt="User Image"
            width={80}
            height={80}
            className="rounded-full object-cover w-20 h-20"
          />
        ) : (
          <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center text-xl font-bold">
            {user?.name?.[0] ?? "U"}
          </div>
        )}
        <div>
          <h2 className="text-2xl font-semibold text-primary">{user?.name ?? "User"}</h2>
          <p className="text-gray-600">{user?.email}</p>
        </div>
      </div>

      {/* Cashback Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 mt-20 gap-4">
        <div className="bg-primary text-white p-4 rounded-lg shadow text-center min-h-[120px] flex flex-col justify-center items-center ">
          <h4 className="text-base font-medium tracking-wide">Total Cashback</h4>
          <p className="text-2xl font-bold mt-2">₹{summary?.total_cb ?? 0}</p>
        </div>
        <div className="bg-yellow-300 text-white p-4 rounded-lg shadow text-center min-h-[120px] flex flex-col justify-center items-center ">
          <h4 className="text-base font-medium tracking-wide">Conform Amount</h4>
          <p className="text-2xl font-bold mt-2">₹{summary?.conform_cb ?? 0}</p>
        </div>
        <div className="bg-green-500 text-white p-4 rounded-lg shadow  min-h-[120px] flex flex-col justify-center items-center text-center">
          <h4 className="text-base font-medium tracking-wide">Total Withdrawal</h4>
          <p className="text-2xl font-bold mt-2">₹{summary?.total_withdrawal ?? 0}</p>
        </div>

        <div className="bg-red-400 text-white p-4 rounded-lg shadow min-h-[120px] flex flex-col justify-center items-center text-center">
          <h4 className="text-base font-medium tracking-wide">Pending Withdrawal</h4>
          <p className="text-2xl font-bold mt-2">₹{summary?.withdrawal_pending ?? 0}</p>
        </div>
        {/* <div className="bg-yellow-400 text-white p-4 rounded-lg shadow min-h-[120px] flex flex-col justify-center items-center text-center">
          <h4 className="text-base font-medium tracking-wide">Total Hold</h4>
          <p className="text-2xl font-bold mt-2">₹{summary?.total_hold ?? 0}</p>
        </div> */}
      </div>
    </div>
  );
};

export default ProfileEdit;
