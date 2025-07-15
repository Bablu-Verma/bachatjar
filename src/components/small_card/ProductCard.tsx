import { ICampaignWithStore } from "@/common_type";
import { getTimeAgo } from "@/helpers/client/client_function";

import Image from "next/image";
import Link from "next/link";


import React from "react";

interface CardProp {
  card_data: ICampaignWithStore;
}

const ProductCard: React.FC<CardProp> = ({ card_data }) => {

  const timeAgo = getTimeAgo(card_data.createdAt ?? new Date());

  return (
    <Link
     href={
      card_data.slug_type === "INTERNAL"
        ? `/campaign/${card_data.product_slug ?? ''}`
        : card_data.extrnal_url ?? '#'
     }
      target={card_data.slug_type !== "INTERNAL" ? '_blank' : '_self'}
      className="shadow-box_shadow_color hover:shadow-box_shadow_hover hover:translate-y-[-6px] bg-white overflow-hidden rounded-lg relative duration-200 border-[1px] border-transparent hover:border-gray-100 hover:border-[1px]  group"
    >
      {card_data?.product_tags && card_data.product_tags.includes("new") ? (
        <span className="absolute top-2 left-2 bg-green-600 py-[1px] px-5 text-[12px] opacity-80 rounded-full shadow-md text-white font-medium z-10 select-none">
          New
        </span>
      ) : card_data?.product_tags && card_data.product_tags.includes("hot") ? (
        <span className="absolute top-2 left-2 bg-red-600 py-[1px] px-5 text-[12px] rounded-full opacity-80 shadow-md text-white font-medium z-10 select-none">
          Hot
        </span>
      ) : null}
      <div className=" overflow-hidden relative p-1 pb-3 sm:pb-0 sm:p-3 flex justify-center items-center">
        <Image
          src={card_data?.product_img}
          className="w-full  h-[150px] rounded-md"
          height={200}
          width={200}
          alt={card_data?.title}
        />
      </div>

      <div className="p-2 pt-2">
        <div className="flex justify-between item-center gap-2">
          <span className="capitalize font-normal text-xs text-gray-500 whitespace-nowrap text-ellipsis overflow-hidden">
            <i className="fa-solid fa-store mr-1"></i>
            {/* <i className="fa-solid fa-shop mr-1"></i> */}
            {card_data?.store.name}
          </span>
          <span className="capitalize font-normal text-xs text-gray-500  whitespace-nowrap text-ellipsis overflow-hidden">
            <i className="fa-regular fa-clock mr-1"></i>
            {timeAgo}
          </span>
        </div>

        <h4
          title={card_data?.title}
          className="text-[#16171a] font-normal text-sm my-1 mb-3 capitalize line-clamp-2"
        >
          {card_data?.title}
        </h4>
        <div className=" mt-1">
          <span>
            <strong className="text-primary text-lg mr-2 sm:text-xl sm:mr-3 mb-1">
              ₹{card_data?.offer_price.toString()}/-
            </strong>
            
            <small className="text-red-500 text-[14px] sm:text-sm py-.5 px-2 border-[1px] border-red-400 ">
              ₹{card_data?.calculated_cashback.toString()} {
               card_data.store.store_type == "INSENTIVE" ?'CB':'Save'
            } 
            </small>
          </span>
          <div className="flex justify-between mt-2 mb-1 items-center ">
             <span className="text-gray-600 text-base font-medium line-through">
              ₹{card_data?.actual_price.toString()}
            </span>
            <button
  className="select-none rounded-full bg-gradient-to-r from-red-500 via-pink-500 to-red-600 text-white text-center font-semibold py-1 px-3 text-[12px] sm:text-sm shadow-md hover:scale-105 hover:shadow-lg transition-all duration-300 ease-in-out"
>
   Grab Now
</button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
