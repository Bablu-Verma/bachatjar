import { getTimeAgo } from "@/helpers/client/client_function";
import { ICampaign } from "@/model/CampaignModel";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface CardProp {
  card_data: ICampaign;
}

const ProductCard: React.FC<CardProp> = ({ card_data }) => {
  const timeAgo = getTimeAgo(card_data.createdAt ?? new Date());


  return (
    <Link
      href={
        card_data.slug_type === "INTERNAL"
          ? `/campaign/${card_data?.product_slug}`
          : card_data?.store?.slug
      }
      className="shadow-box_shadow_color hover:shadow-box_shadow_hover hover:translate-y-[-6px] bg-white overflow-hidden rounded-lg relative duration-200 border-[1px] border-transparent hover:border-gray-100 hover:border-[1px]  group"
    >
      {card_data?.product_tags && card_data.product_tags.includes("new") ? (
        <span className="absolute top-2 left-2 bg-green-600 py-[1px] px-5 text-[12px] rounded-md shadow-md text-white font-medium z-10 select-none"> 
          New
        </span>
      ) : card_data?.product_tags && card_data.product_tags.includes("hot") ? (
        <span className="absolute top-2 left-2 bg-red-600 py-[1px] px-5 text-[12px] rounded-md shadow-md text-white font-medium z-10 select-none">
          Hot
        </span>
      ) : null}
      <div className=" overflow-hidden relative p-1 pb-3 sm:pb-0 sm:p-3 flex justify-center items-center">
        <Image
          src={card_data?.product_img}
          className="w-full  h-[150px] rounded-t-md"
          height={200}
          width={200}
          alt="shose"
        />
      </div>

      <div className="p-3 pt-0">
        <div className="flex justify-between item-center">
          <span className="capitalize font-normal text-xs text-gray-500">
            {/* <i className="fa-solid fa-store mr-1"></i> */}
            <i className="fa-solid fa-shop mr-1"></i>
            {card_data?.store.name}
          </span>
          <span className="capitalize font-normal text-xs text-gray-500">
            <i className="fa-regular fa-clock mr-1"></i>
            {timeAgo}
          </span>
        </div>

        <h4
          title={card_data?.title}
          className="text-[#16171a] font-normal text-sm my-1 mb-5 capitalize line-clamp-2"
        >
          {card_data?.title}
        </h4>
        <div className="flex items-center justify-between mt-1">
          <span>
            <strong className="text-primary text-lg mr-2 sm:text-xl sm:mr-3 mb-1">
              ₹{card_data?.offer_price.toString()}/-
            </strong>
            <small className="text-red-500 text-[14px] sm:text-sm py-.5 px-2 border-[1px] border-red-500 ">
              ₹{card_data?.calculated_cashback.toString()} Off
            </small>
            <br />
            <span className="text-gray-600 text-base font-medium line-through">
              ₹{card_data?.actual_price.toString()}
            </span>
          </span>
          <div className="flex justify-between mt-4 mb-1 items-center ">
            <button
              className="select-none rounded-md text-[#2491ef] font-medium py-1 text-sm duration-200 text-nowrap ease-in-out
           "
            >
              GRAB NOW
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
