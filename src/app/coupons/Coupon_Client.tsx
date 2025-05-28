"use client";

import React, { useEffect, useState } from "react";

import axios, { AxiosError } from "axios";
import { coupons_list_api } from "@/utils/api_url";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";
import { ICoupon } from "@/model/CouponModel";
import CouponcodeCard from "@/components/small_card/CouponcodeCard";

interface CProps {
    coupons: ICoupon[];
}

const CouponClient: React.FC<CProps> = ({ coupons }) => {
 
  const [page, setPage] = useState(1);
  const [Coupons, setSetCoupons] = useState<ICoupon[]>(coupons);

  const token = useSelector((state: RootState) => state.user.token);

  const getCoupon = async (reset: boolean = false) => {
    try {
      const { data } = await axios.post(
        coupons_list_api,
        { page}, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const newDeals = data.data || [];
      setSetCoupons((prev) => (reset ? newDeals : [...prev, ...newDeals]));
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error fetching deals:", error.response?.data.message);
      } else {
        console.error("Unknown error", error);
      }
    }
  };

  useEffect(() => {
    if (page > 1) getCoupon();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

 
  return (
    <>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mt-6 lg:mt-10">
            {
              Coupons.map((item: ICoupon, i) => (
                <CouponcodeCard key={i} item={item} />
              ))
            }
          </div>
          <div className="flex justify-center items-center pt-10 ">
          <button onClick={()=>setPage(page+1)} className="text-sm py-2 px-8 transition-all duration-300 ease-in-out rounded-full border-2 border-primary text-white bg-primary ">More Coupon</button>
        </div>
    </>
  );
};

export default CouponClient;
