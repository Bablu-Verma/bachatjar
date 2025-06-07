"use client";

import React, { useState } from "react";
import ProductCard from "../small_card/ProductCard";
import { ICampaign } from "@/model/CampaignModel";
import axios, { AxiosError } from "axios";
import { home_api } from "@/utils/api_url";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";

import SimpleLoader from "../SimpleLoader";

interface DealsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  best_product: any;
}

const Deals: React.FC<DealsProps> = ({ best_product }) => {
  const [openTab, setOpenTab] = useState(
    "hot"
  );
  const [page, setPage] = useState(1);
  const [deals, setDeals] = useState<ICampaign[]>(best_product.offer_deal);

  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);



  const tab = [
    {
      name: 'Hot Deals',
      tag: 'hot',
      id: 1,
    },
    {
      name: 'New deals',
      tag: 'new',
      id: 2,
    },
    {
      name: 'Live deals',
      tag: 'live',
      id: 3,
    }


  ]

  const token = useSelector((state: RootState) => state.user.token);

  const getDeals = async (page: number, tab: string) => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        home_api,
        { page: page, tab: tab },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );



      if (page == 1) {
        const newDeals = data.data || [];
        if (newDeals.length === 0) setHasMore(false)
        setDeals(newDeals);
      } else {
        const newDeals = data.data || [];
        if (newDeals.length === 0) setHasMore(false);
        setDeals((prev) => [...prev, ...newDeals]);
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

  // Tab change par hasMore reset karein
  const handleTabChange = (tab: string) => {
    setOpenTab(tab);
    setPage(1);
    setHasMore(true);
    getDeals(1, tab)
  };

  return (
    <div className="max-w-6xl mx-auto pt-2 mb-4 relative">
      <div className="flex px-2 justify-start items-center py-4 gap-6">
        {
          tab.map((item, i) => {
            return (
              <button
                key={i}
                onClick={() => handleTabChange(item.tag)}
                className={`text-sm py-1 px-6 transition-all duration-300 ease-in-out rounded-full border-2 border-primary ${openTab === item.tag
                  ? "text-white bg-primary"
                  : "text-primary bg-white"
                  }`}
              >
                {item.name}
              </button>
            )
          })
        }


      </div>

      <div className="grid px-2 grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4 lg:grid-cols-4">
        {deals && deals?.map((item, i) => (
          <ProductCard key={item._id || i} card_data={item} />
        ))
        }
      </div>
      <div className="flex justify-center items-center pt-10">
        {
          hasMore ? (
            <button
              onClick={() => {
                getDeals(page + 1, openTab);
                setPage((prev) => prev + 1);
              }}
              className="text-sm w-36 py-2 px-8 transition-all duration-300 ease-in-out rounded-full border-2 border-primary hover:border-white text-white bg-primary flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <SimpleLoader />
              ) : (
                "More Deals"
              )}
            </button>
          ) : (
            <span className="text-gray-500 text-sm">No more deals</span>
          )

        }
      </div>


    </div>
  );
};

export default Deals;


