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
import SimpleLoader from "@/components/SimpleLoader";

interface ATProps {
  relatedCoupons: ICoupon[];
  relatedProducts: ICampaign[];
  slug: string;
}

const StoreClientTab: React.FC<ATProps> = ({ relatedProducts, relatedCoupons, slug }) => {
  const [openTab, setOpenTab] = useState("Product");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [Coupons, setSetCoupons] = useState<ICoupon[]>(relatedCoupons);
  const [Product, setProduct] = useState<ICampaign[]>(relatedProducts);

  const token = useSelector((state: RootState) => state.user.token);

  const getCoupon = async () => {
    setLoading(true);
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
        const newProducts = data.data.related_product || [];
        if (newProducts.length === 0) setHasMore(false);
        setProduct([...Product, ...newProducts]);
      } else if (openTab === "Coupons") {
        const newCoupons = data.data.related_coupons || [];
        if (newCoupons.length === 0) setHasMore(false);
        setSetCoupons([...Coupons, ...newCoupons]);
      }
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

  // Reset page and hasMore when tab changes
  const handleTabChange = (tab: string) => {
    setOpenTab(tab);
    setPage(1);
    setHasMore(true);
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
          onClick={() => handleTabChange("Product")}
          className={`${openTab == "Product" ? 'bg-gray-600' : 'bg-gray-300'} py-1.5 text-white capitalize text-center text-lg`}
        >
          Product
        </button>
        <button
          type="button"
          onClick={() => handleTabChange("Coupons")}
          className={`${openTab == "Coupons" ? 'bg-gray-600' : 'bg-gray-300'} py-1.5 text-white capitalize text-center text-lg`}
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
            return <CouponcodeCard item={item} key={i} />;
          })}
        </div>
      )}

      <div className="flex justify-center items-center pt-10">
        {((openTab === "Product" && Product.length >= 10) ||
          (openTab === "Coupons" && Coupons.length >= 10)) ? (
          hasMore ? (
            <button
              onClick={() => setPage(page + 1)}
              className="text-sm py-2 w-36 px-4 transition-all duration-300 ease-in-out rounded-full border-2 border-primary text-white bg-primary flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <SimpleLoader />
              ) : (
                `More ${openTab === 'Coupons' ? 'Coupon' : 'Product'}`
              )}
            </button>
          ) : (
            <span className="text-gray-500 text-sm">
              No more {openTab === 'Coupons' ? 'coupons' : 'products'}
            </span>
          )
        ) : null}
      </div>
    </div>
  );
};

export default StoreClientTab;
