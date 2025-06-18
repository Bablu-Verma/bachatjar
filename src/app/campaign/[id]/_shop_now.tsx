"use client";

import React  from "react";
import { ICampaign } from "@/model/CampaignModel";

import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";
import { IoMdShare } from "react-icons/io";
import { IUser } from "@/common_type";



interface IShopNowProps {
  page_data: ICampaign;
}
const ShopNowButton: React.FC<IShopNowProps> = ({ page_data }) => {
  const token = useSelector((state: RootState) => state.user.token);
  const user = useSelector((state: RootState) => state.user.user) as IUser | null;


  const shop_now = async () => {
    if (!token) {
      toast.error("You need to login to proceed");

      setTimeout(() => {
        window.location.href = "/login";
      }, 5000);

      return;
    }

   const storeId = page_data.store._id;
   window.open(`/create-order?store_id=${storeId}`, '_blank');

  };



  const create_share_link = () => {
    if (!token) {
      toast.error("You need to login to proceed");

      setTimeout(() => {
        window.location.href = "/login";
      }, 5000);

      return;
    }

    const create_link = `${process.env.NEXT_PUBLIC_SITE_URL}/create-share-order?store_id=${page_data.store._id}&user_id=${user?._id}`

    navigator.clipboard
      .writeText(create_link)
      .then(() => {
        toast.success("Link copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        toast.error("Failed to copy link. Please try again.");
      });

  }





  return (
    <div className="flex gap-3  md:gap-5 flex-wrap">
      <button
        onClick={shop_now}
        className="w-[150px]  sm:w-[180px]  py-2 text-base text-center rounded-full outline-none border-none text-white  duration-200 bg-primary"
      >
        Shop Now
      </button>

      <button
        type="button"
        onClick={create_share_link}
        title='Share & Earn'
        className=" justify-center items-center gap-2 text-base border-[1px] text-nowrap border-green-400 text-secondary inline-flex px-6 py-2 bg-green-400 rounded-full"
      >
        <span className="hidden md:inline-block">Share Link</span>
        <IoMdShare className="text-lg" />
      </button>
    </div>
  );
};

export default ShopNowButton;
