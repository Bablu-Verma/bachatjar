"use client";

import React, { useCallback, useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import CouponcodeCard from "@/components/small_card/CouponcodeCard";
import ProductCard from "@/components/small_card/ProductCard";
import StoreCard from "@/components/small_card/StoreCard";
import SimpleLoader from "@/components/SimpleLoader";

import { ICoupon } from "@/model/CouponModel";
import { IStore } from "@/model/StoreModel";
import { RootState } from "@/redux-store/redux_store";
import { category_details_api } from "@/utils/api_url";
import axios, { AxiosError } from "axios";
import { ICampaignWithStore } from "@/common_type";


interface TabData {
  Product: ICampaignWithStore[];
  Coupons: ICoupon[];
  Store: IStore[];
}

interface CAProps {
  relatedCoupons: ICoupon[];
  relatedProducts: ICampaignWithStore[];
  relatedStore: IStore[];
  slug: string;
}

const CategoryClientTab: React.FC<CAProps> = ({ 
  slug, 
  relatedProducts, 
  relatedCoupons, 
  relatedStore 
}) => {
  const [openTab, setOpenTab] = useState<keyof TabData>("Product");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [data, setData] = useState<TabData>({
    Product: relatedProducts,
    Coupons: relatedCoupons,
    Store: relatedStore,
  });

  const token = useSelector((state: RootState) => state.user.token);

  const getCoupon = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        category_details_api,
        { slug, page, tabtype: openTab },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const newItems = response.data.data[`related${openTab}`] || [];
      if (newItems.length === 0) setHasMore(false);

      setData(prev => ({
        ...prev,
        [openTab]: [...prev[openTab], ...newItems]
      }));
    } catch (error) {
      console.error(
        "Error:", 
        error instanceof AxiosError ? error.response?.data.message : error
      );
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [slug, page, openTab, token]);

  const handleTabChange = useCallback((tab: keyof TabData) => {
    setOpenTab(tab);
    setPage(1);
    setHasMore(true);
  }, []);

  useEffect(() => {
    if (page > 1) getCoupon();
  }, [getCoupon, page]);

  const tabButtons = useMemo(() => [
    { id: "Product", label: "Product" },
    { id: "Coupons", label: "Coupons" },
    { id: "Store", label: "Store" },
  ] as const, []);

  const renderContent = useMemo(() => ({
    Product: (items: ICampaignWithStore[]) => (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-6">
        {items.map((item, i) => (
          <ProductCard card_data={item} key={item._id || i} />
        ))}
      </div>
    ),
    Coupons: (items: ICoupon[]) => (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
        {items.map((item, i) => (
          <CouponcodeCard item={item} key={item._id || i} />
        ))}
      </div>
    ),
    Store: (items: IStore[]) => (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-8 mt-6 lg:mt-10">
        {items.map((item, i) => (
          <StoreCard item={item} key={item._id ? String(item._id) : String(i)} />
        ))}
      </div>
    ),
  }), []);

  const currentItems = data[openTab];
  const showLoadMore = currentItems.length >= 10;

  return (
    <div className="mt-16">
      <div className="grid grid-cols-3 gap-[1px] mb-10 rounded-md overflow-hidden">
        {tabButtons.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => handleTabChange(id)}
            className={`${
              openTab === id ? 'bg-gray-600' : 'bg-gray-300'
            } py-1.5 text-white capitalize text-center text-lg`}
          >
            {label}
          </button>
        ))}
      </div>

      {currentItems.length > 0 &&
        (openTab === "Product"
          ? renderContent.Product(currentItems as ICampaignWithStore[])
          : openTab === "Coupons"
          ? renderContent.Coupons(currentItems as ICoupon[])
          : renderContent.Store(currentItems as IStore[])
        )
      }

      <div className="flex justify-center items-center pt-10">
        {showLoadMore && (
          hasMore ? (
            <button
              onClick={() => setPage(prev => prev + 1)}
              className="text-sm py-2 px-4 w-36 transition-all duration-300 ease-in-out rounded-full border-2 border-primary text-white bg-primary flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <SimpleLoader />
              ) : (
                `More ${openTab}`
              )}
            </button>
          ) : (
            <span className="text-gray-500 text-sm">
              No more {openTab.toLowerCase()}s
            </span>
          )
        )}
      </div>
    </div>
  );
};

export default CategoryClientTab;
