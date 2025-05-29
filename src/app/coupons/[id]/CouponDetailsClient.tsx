"use client";

import { RootState } from "@/redux-store/redux_store";
import { track_coupon_copy_api } from "@/utils/api_url";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaAngleDoubleRight } from "react-icons/fa";
import { useSelector } from "react-redux";


// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CouponDetailsClient = ({ page_data }: any) => {
  const [showCode, setShowCode] = useState(false);
  const router = useRouter();
  const token = useSelector((state: RootState) => state.user.token);

 
  const send_code = async() => {
     try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
       await axios.post(track_coupon_copy_api,
        {
          coupon_id:page_data._id
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        })
     } catch (error) {
       console.log(error)
     }
}



  const handle_user_click = async () => {
    await navigator.clipboard.writeText(page_data.code);
    setShowCode(!showCode);
    send_code()
  };

  const open_clint_web = (item:string)=>{
    if(!token){
      router.replace('/login')
    }
    window.open(item, '_blank');
  }



  return (
    <div className="max-w-[700px] m-auto shadow-sm rounded rounded-tr-3xl rounded-bl-3xl relative hover:shadow-lg duration-200 border-[1px] border-gray-200 py-8 px-7  bg-[#fff]">
      <div className="flex justify-between items-end">
        <Image
          src={page_data.store.store_img}
          alt={page_data.store.name}
          width={70}
          height={50}
          className="rounded-md ml-1 mb-3"
        />
      </div>
      <h2 className="text-xl text-secondary font-semibold tracking-wide mb-3">
        Flat ₹{page_data.discount} Off
      </h2>
      <h4 className="text-base text-green-500 font-medium line-clamp-2 capitalize">
        {page_data.title}
      </h4>

      <div
        className={`bg-gray-100  border-dashed relative border-2 h-12 mt-8 rounded-md flex ${
          showCode ? "justify-center" : "justify-end"
        } items-center p-2`}
      >
        {showCode ? (
          <span className="absolute -top-[1px] -left-[1px] w-[45%] md:w-[30%] bg-gray-500 h-12 rounded-md text-base text-white items-center font-medium tracking-wide flex justify-center">
            Coppied
          </span>
        ) : (
          <span
            onClick={handle_user_click}
            className="absolute -top-[1px] -left-[1px] w-[96%] bg-primary h-12 rounded-md text-base text-white cursor-pointer items-center font-medium tracking-wide flex justify-center"
          >
            Show Coupon
          </span>
        )}

        <p
          className={`${
            showCode ? "text-center ml-24 md:ml-20" : "text-base"
          } font-medium`}
        >
          {showCode ? page_data.code : "00000"}
        </p>
      </div>
      {
        // store_link
        showCode && <p className="text-center mt-7"><a className="text-primary cursor-pointer inline-flex  underline justify-center items-center gap-1" onClick={()=>open_clint_web(page_data.store.store_link)}  ><span>Go to Partner Site</span> <FaAngleDoubleRight /></a></p>
      }
    </div>
  );
};

export default CouponDetailsClient;
