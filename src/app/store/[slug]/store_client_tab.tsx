"use client";

import CouponcodeCard from "@/components/small_card/CouponcodeCard";
import ProductCard from "@/components/small_card/ProductCard";
import { ICampaign } from "@/model/CampaignModel";
import { ICoupon } from "@/model/CouponModel";
import { RootState } from "@/redux-store/redux_store";
import { store_details_api } from "@/utils/api_url";
import axios, { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";



interface ATProps {
  relatedCoupons: ICoupon[];
  relatedProducts: ICampaign[];
  slug: string
}



const StoreClientTab: React.FC<ATProps> = ({ relatedProducts, relatedCoupons, slug }) => {
  const [openTab, setOpenTab] = useState("Product");
  const [page, setPage] = useState(1)
  const [Coupons, setSetCoupons] = useState<ICoupon[]>(relatedCoupons);
  const [Product, setProduct] = useState<ICampaign[]>(relatedProducts);


  const token = useSelector((state: RootState) => state.user.token);


  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getCoupon = async (reset: boolean = false) => {
    try {
      const { data } = await axios.post(
        store_details_api,
        { slug, page, tabtype: openTab },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (openTab === "Product") {
        setProduct([...Product, ...data.data.related_product]);
      } else if (openTab === "Coupons") {
        setSetCoupons([...Coupons, ...data.data.related_coupons]);
      }
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
    <div className="">
      <div className="grid grid-cols-2 gap-[1px] mb-10 rounded-md overflow-hidden">
        <button
          type="button"
          onClick={() => setOpenTab("Product")}
          className={` ${openTab == "Product" ? 'bg-gray-600' : 'bg-gray-300'} py-1.5 text-white capitalize text-center text-lg`}
        >
          Product
        </button>
        <button
          type="button"
          onClick={() => setOpenTab("Coupons")}
          className={` ${openTab == "Coupons" ? 'bg-gray-600' : 'bg-gray-300'} py-1.5 text-white capitalize text-center text-lg`}
        >
          Coupons
        </button>

      </div>
      {openTab == "Product" &&
        Product &&
        Product.length > 0 && (
          <div className="grid grid-rows-1 sm:grid-cols-2  lg:grid-cols-3 gap-3 md:gap-6">
            {Product.map((item, i) => {
              return <ProductCard card_data={item} key={i} />;
            })}
          </div>
        )}
      {openTab == "Coupons" && relatedCoupons && relatedCoupons.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {Coupons.map((item, i) => {
            return <CouponcodeCard item={item} key={i}/>;
          })}
        </div>
      )}

      <div className="flex justify-center items-center pt-10 ">
        <button
          onClick={() => setPage(page + 1)}
          className="text-sm py-2 px-8 transition-all duration-300 ease-in-out rounded-full border-2 border-primary text-white bg-primary"
        >
          More {openTab === 'Coupons' ? 'Coupon' : 'Product'}
        </button>
      </div>

    </div>
  );
};

export default StoreClientTab;
