"use client";

import React, { useState } from "react";
import ProductCard from "../small_card/ProductCard";
import { ICampaign } from "@/model/CampaignModel";
import axios, { AxiosError } from "axios";
import { home_api } from "@/utils/api_url";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";
import Image from "next/image";
import { getTimeAgo } from "@/helpers/client/client_function";

interface DealsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  best_product: any;
}

const Deals: React.FC<DealsProps> = ({ best_product }) => {
  const [openTab, setOpenTab] = useState<"hot_deals" | "live_offer">("hot_deals");
  const [page, setPage] = useState(1);
  const [deals, setDeals] = useState<ICampaign[]>(best_product.offer_deal);
  const [liveDeal, setLiveDeal] = useState<ICampaign[]>(best_product.live_deal);

  const token = useSelector((state: RootState) => state.user.token);

  console.log("best_product",best_product)

  const getDeals = async (page: number) => {
    try {
      const { data } = await axios.post(
        home_api,
        { page: page, tab: openTab },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(data)
      if (openTab == 'hot_deals') {
        const newDeals = data.data?.offer_deal || [];
        setDeals((prev) => [...prev, ...newDeals]);
      } else if (openTab == 'live_offer') {
        const newDeals = data.data?.live_deal || [];
        setLiveDeal((prev) => [...prev, ...newDeals]);
      }

    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error fetching deals:", error.response?.data.message);
      } else {
        console.error("Unknown error", error);
      }
    }
  };

  // useEffect(() => {
  //   if (page > 1) getDeals();
  // }, [page]);

  console.log(liveDeal)

  return (
    <div className="max-w-6xl mx-auto pt-2 mb-4 relative">
      <div className="flex px-2 justify-start items-center py-4 gap-6">
        <button
          onClick={() => {
            setOpenTab("hot_deals")
            setPage(1)
          }}
          className={`text-sm py-1 px-6 transition-all duration-300 ease-in-out rounded-full border-2 border-primary ${openTab === "hot_deals" ? "text-white bg-primary" : "text-primary bg-white"
            }`}
        >
          Hot Deals
        </button>
        <button
          onClick={() => {
            setOpenTab("live_offer")
            setPage(1)
          }}
          className={`text-sm py-1 px-6 transition-all duration-300 ease-in-out rounded-full border-2 border-primary ${openTab === "live_offer" ? "text-white bg-primary" : "text-primary bg-white"
            }`}
        >
          Live Deals
        </button>
      </div>

      <div className="grid px-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4 lg:grid-cols-4">
        {openTab == 'hot_deals' && deals.map((item, i) => (
          <ProductCard key={item._id || i} card_data={item} />
        ))}
        {openTab == 'live_offer' && liveDeal.map((item, i) => (
          // <ProductCard key={item._id || i} card_data={item} />
          <LiveDealCard key={i} item={item} />
        ))}
      </div>

      <div className="flex justify-center items-center pt-10">
        <button
          onClick={() => {
            getDeals(page + 1)
            setPage((prev) => prev + 1)
          }}
          className="text-sm py-2 px-8 transition-all duration-300 ease-in-out rounded-full border-2 border-primary hover:border-white text-white bg-primary"
        >
          More Deals
        </button>
      </div>
    </div>
  );
};

export default Deals;


// eslint-disable-next-line @typescript-eslint/no-explicit-any
const LiveDealCard = ({ item }: any) => {
  const timeAgo = getTimeAgo(item.createdAt ?? new Date());
  return (
    <a
      href={item.client_id}
      target="_blank"
      className="shadow-box_shadow_color hover:shadow-box_shadow_hover hover:translate-y-[-6px] bg-white overflow-hidden rounded-lg relative duration-200 border-[1px] border-transparent hover:border-gray-100 hover:border-[1px]  group"
    >
<span className='absolute top-5 left-0 bg-primary text-white z-30 text-[12px]  py-.5 px-3 rounded-r-[2px]'>Live</span>
      <div className=" overflow-hidden relative p-1 pb-3 sm:pb-0 sm:p-3 flex justify-center items-center">
        <Image
          src={item?.image}
          className="w-full  h-[150px] rounded-t-md"
          height={200}
          width={200}
          alt="shose"
        />
      </div>

      <div className="p-3">
        <div className="flex justify-between item-center">
          <span className="capitalize font-normal text-xs text-gray-500">
            {/* <i className="fa-solid fa-store mr-1"></i> */}
            <i className="fa-solid fa-shop mr-1"></i>
            {item?.source}
          </span>
          <span className="capitalize font-normal text-xs text-gray-500">
            <i className="fa-regular fa-clock mr-1"></i>
            {timeAgo}
          </span>
        </div>

        <h4
          title={item?.title}
          className="text-[#16171a] font-normal text-sm my-1 mb-5 capitalize line-clamp-3"
        >
          {item?.title}
        </h4>
        <div className="flex items-center justify-between mt-1">
          <span>
            <strong className="text-primary text-lg mr-2 sm:text-xl sm:mr-3 mb-1">
              {item?.price.toString()}/-
            </strong>
            {
              item.real_price && <span className="text-gray-600 text-base font-medium line-through">
                {item.real_price.toString()}
              </span>
            }

          </span>
          <div className="flex justify-between  mb-1 items-center ">
            <button
              className="select-none rounded-md text-[#2491ef] font-medium py-1 text-sm duration-200 text-nowrap ease-in-out
         "
            >
              GRAB NOW
            </button>
          </div>
        </div>
      </div>
    </a>
  )
}