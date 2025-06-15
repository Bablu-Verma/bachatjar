"use client";

import { ICoupon } from "@/model/CouponModel";
import { IStore } from "@/model/StoreModel";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface CouponcodeCardProps {
  item: ICoupon;
}
const CouponcodeCard: React.FC<CouponcodeCardProps> = ({ item }) => {
  // console.log(item);
  return (
    <Link
      href={`/coupons/${item._id}`}
      className="shadow-sm rounded rounded-tr-3xl rounded-bl-3xl relative hover:shadow-lg duration-200 border-[1px] border-gray-200 p-4 lg:p-6  bg-[#fff]"
    >
      <Image
        src={"/placeholder.png"}
        alt={'store image'}
        width={70}
        height={50}
        className="rounded-md ml-1 mb-3"
      />
      <h2 className="text-lg text-secondary font-semibold tracking-wide mb-1">
        Flat {item.discount} Off
      </h2>
      <h4 className="text-sm lg:text-base text-primary font-medium line-clamp-2 capitalize">
        {item.title}
      </h4>

      <div className="bg-gray-100 border-dashed relative border-2 h-12 mt-8 rounded-md flex justify-end items-center p-2  ">
        <span className="absolute -top-[1px] -left-[1px] w-[82%] md:w-[93%] lg:w-[88%] bg-primary h-12 rounded-md text-sm lg:text-base text-white items-center font-medium tracking-wide flex justify-center">
          Show Coupon
        </span>
        <p className="text-sm lg:text-base font-medium">00000</p>
      </div>
    </Link>
  );
};

export default CouponcodeCard;
