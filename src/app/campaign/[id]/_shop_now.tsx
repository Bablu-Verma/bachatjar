"use client";

import React from "react";
import { ICampaign } from "@/model/CampaignModel";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";
import { create_order_api } from "@/utils/api_url";
import { ProgressBar } from "react-loader-spinner";
import { IoMdShare } from "react-icons/io";
import { IUser } from "@/common_type";

interface IShopNowProps {
  page_data: ICampaign;
}
const ShopNowButton: React.FC<IShopNowProps> = ({ page_data }) => {
  const token = useSelector((state: RootState) => state.user.token);
  const user = useSelector((state: RootState) => state.user.user) as IUser | null;
  const [modelOpen, setModelOpen] = React.useState<boolean>(false);


  console.log("user data", user)

  const shop_now = async () => {
    if (!token) {
      toast.error("You need to login to proceed");

      setTimeout(() => {
        window.location.href = "/login";
      }, 5000);

      return;
    }

    setModelOpen(true);

    try {
      const { data } = await axios.post(
        create_order_api,
        {
          store_id: page_data.store._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (data.success == true) {
        // console.log(data);
        setTimeout(() => {
          setModelOpen(false);
          if (data?.url && typeof data.url === "string") {
            window.location.href = data.url
          } else {
            console.error("Invalid URL");
          }

        }, 3000);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error registering user", error.response?.data.message);
        toast.error(error.response?.data.message);
      } else {
        console.error("Unknown error", error);
      }
      setTimeout(() => {
        setModelOpen(false);
      }, 1000);
    }
  };



  const create_share_link = () => {
    if (!token) {
      toast.error("You need to login to proceed");

      setTimeout(() => {
        window.location.href = "/login";
      }, 5000);

      return;
    }

    const create_link = `${process.env.NEXT_PUBLIC_SITE_URL}/create-order?store_id=${page_data.store._id}&user_id=${user?._id}`

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
      {modelOpen && (
        <div
          style={{ background: "rgba(0,0,0,.5)" }}
          className="fixed top-0 h-[100vh] w-[100vw] left-0 justify-center items-center flex"
        >
          <div className="bg-white rounded-lg pt-5 px-8 pb-10 flex flex-col justify-center items-center">
            <ProgressBar
              visible={true}
              height="60"
              width="80"
              barColor="#d85134"
              borderColor="#0f1336"
              ariaLabel="progress-bar-loading"
              wrapperStyle={{ margin: "0px" }}
              wrapperClass=""
            />
            <p className="text-sm text-secondary">
              Wait we are creating your Order
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopNowButton;
