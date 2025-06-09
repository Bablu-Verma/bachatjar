"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "../small_card/ProductCard";
import { ICampaign } from "@/model/CampaignModel";
import axios from "axios";
import { home_deals_api } from "@/utils/api_url";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";
import SimpleLoader from "../SimpleLoader";

const Deals: React.FC = () => {
  const [openTab, setOpenTab] = useState<string>("all");
  const [page, setPage] = useState<number>(1);
  const [deals, setDeals] = useState<ICampaign[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const token = useSelector((state: RootState) => state.user.token);

  const tabOptions = [
    { name: "Our Offers", tag: "all" },
    { name: "Hot Deals", tag: "hot" },
    { name: "Live", tag: "live" },
  ];

  const getDeals = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        home_deals_api,
        { page, tag: openTab },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const newDeals: ICampaign[] = data?.data || [];
      if (newDeals.length === 0) setHasMore(false);

      setDeals((prev) => [...prev, ...newDeals]);
    } catch (error: any) {
      console.error("Error fetching deals:", error?.response?.data?.message || error.message);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setDeals([]); // Reset data on tab change
    setHasMore(true);
    setPage(1);
  }, [openTab]);

  useEffect(() => {
    getDeals();
  }, [page, openTab]);

  const handleTabChange = (tag: string) => {
    if (tag !== openTab) {
      setOpenTab(tag);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pt-2 mb-4 relative">
      {/* Tabs */}
      <div className="flex px-2 justify-start items-center py-4 gap-6">
        {tabOptions.map((item) => (
          <button
            key={item.tag}
            onClick={() => handleTabChange(item.tag)}
            className={`text-sm py-1 px-6 transition-all duration-300 ease-in-out rounded-full border-2 border-primary ${
              openTab === item.tag ? "text-white bg-primary" : "text-primary bg-white"
            }`}
          >
            {item.name}
          </button>
        ))}
      </div>

      {/* Deals Grid */}
      <div className="grid px-2 grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4 lg:grid-cols-4">
        {deals.map((item) => (
          <ProductCard key={item._id} card_data={item} />
        ))}
      </div>

      {/* Load More */}
      <div className="flex justify-center items-center pt-10">
        {hasMore ? (
          <button
            onClick={() => setPage((prev) => prev + 1)}
            className="text-sm w-36 py-2 px-8 transition-all duration-300 ease-in-out rounded-full border-2 border-primary hover:border-white text-white bg-primary flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? <SimpleLoader /> : "More Deals"}
          </button>
        ) : (
          <span className="text-gray-500 text-sm">No more deals</span>
        )}
      </div>
    </div>
  );
};

export default Deals;
