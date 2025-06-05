"use client";

import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { coupons_list_api } from "@/utils/api_url";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";
import { ICoupon } from "@/model/CouponModel";
import CouponcodeCard from "@/components/small_card/CouponcodeCard";
import SimpleLoader from "@/components/SimpleLoader";

interface CProps {
  coupons: ICoupon[];
}

const CouponClient: React.FC<CProps> = ({ coupons }) => {
  const [page, setPage] = useState(1);
  const [Coupons, setSetCoupons] = useState<ICoupon[]>(coupons);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const token = useSelector((state: RootState) => state.user.token);

  const getCoupon = async (reset: boolean = false) => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        coupons_list_api,
        { page },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const newDeals = data.data || [];
      if (newDeals.length === 0) setHasMore(false);
      setSetCoupons((prev) => (reset ? newDeals : [...prev, ...newDeals]));
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error fetching deals:", error.response?.data.message);
      } else {
        console.error("Unknown error", error);
      }
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (page > 1) getCoupon();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mt-6 lg:mt-10">
        {Coupons.map((item: ICoupon, i) => (
          <CouponcodeCard key={i} item={item} />
        ))}
      </div>
      <div className="flex justify-center items-center pt-10 ">
        {Coupons.length >= 10 ? (
          hasMore ? (
            <button
              onClick={() => setPage(page + 1)}
              className="text-sm py-2 px-8 transition-all duration-300 ease-in-out rounded-full border-2 border-primary text-white bg-primary flex items-center gap-2"
              disabled={loading}
            >
              {loading ? <SimpleLoader /> : "More Coupon"}
            </button>
          ) : (
            <span className="text-gray-500 text-sm">No more coupon</span>
          )
        ) : null}
      </div>
    </>
  );
};

export default CouponClient;
