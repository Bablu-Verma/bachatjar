"use client";

import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";

import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";
import { IReferral } from "@/model/ReferralModel"; // Use your referral model

import SimpleLoader from "@/components/SimpleLoader";
import { referral_product_list_client_api } from "@/utils/api_url";
import ReferralCard from "@/components/small_card/ReferralCard";

interface ReferralProps {
  referrals: IReferral[];
}

const ReferralClient: React.FC<ReferralProps> = ({ referrals }) => {
  const [page, setPage] = useState(1);
  const [referralList, setReferralList] = useState<IReferral[]>(referrals);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const token = useSelector((state: RootState) => state.user.token);

  const getReferrals = async (reset = false) => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        referral_product_list_client_api,
        { page },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const newData = data.data || [];
      if (newData.length === 0) setHasMore(false);

      setReferralList((prev) => (reset ? newData : [...prev, ...newData]));
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error fetching referrals:", error.response?.data.message);
      } else {
        console.error("Unknown error", error);
      }
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (page > 1 || referrals.length === 0) getReferrals(page === 1);
  }, [page]);

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mt-6 lg:mt-10">
        {referralList.map((item) => (
          <ReferralCard key={item._id.toString()} item={item} />
        ))}
      </div>

      <div className="flex justify-center items-center pt-10">
        {hasMore ? (
          <button
            onClick={() => setPage((prev) => prev + 1)}
            className="text-sm py-2 px-8 transition-all duration-300 ease-in-out rounded-full border-2 border-primary text-white bg-primary flex items-center gap-2"
            disabled={loading}
          >
            {loading ? <SimpleLoader /> : "More Referrals"}
          </button>
        ) : (
          <span className="text-gray-500 text-sm">No more referrals</span>
        )}
      </div>
    </>
  );
};

export default ReferralClient;
