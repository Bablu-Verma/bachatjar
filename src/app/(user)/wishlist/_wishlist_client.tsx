"use client";


import { ICampaign } from "@/model/CampaignModel";
import { RootState } from "@/redux-store/redux_store";
import { addItem, removeItem } from "@/redux-store/slice/wishlistSlice";
import { wishlist_product_remove_ } from "@/utils/api_url";
import axios, { AxiosError } from "axios";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

interface IWCProps {
  item_: ICampaign[];
}

const Wishlist_client: React.FC<IWCProps> = ({ item_ }) => {
  const token = useSelector((state: RootState) => state.user.token);
  const dispatch = useDispatch();
  const wishlist = useSelector((state: RootState) => state.wishlist.items);

  useEffect(() => {
    dispatch(addItem(item_));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])



  const remover_data = async (id: string) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
       await axios.post(
        wishlist_product_remove_,
        { product_id: id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );


      dispatch(removeItem(id));
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error Product remove ", error.response?.data.message);
        toast.error(error.response?.data.message);
      } else {
        console.error("Unknown error", error);
        toast.error("Failed to remove product. Please try again.");
      }
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 pt-2 md:grid-cols-3 gap-2 sm:gap-4 lg:grid-cols-4">
        {wishlist.map((item, i) => (
         
          <div key={i} className="bg-white border-[1px] rounded overflow-hidden border-gray-300 ">
            <div className='relative  flex justify-center'>
              <button
                className="bg-red-600 opacity-70 h-8 w-8 rounded-full text-white absolute right-1 top-1 p-1 hover:opacity-100"
                title="Remove this item"
                onClick={() => remover_data(item._id ?? 0)}
              >
                <i className="fa-solid fa-trash text-sm"></i>
              </button>
              <Image
                src={item.product_img}
                className="h-28 w-auto rounded-md"
                width={100}
                height={100}
                sizes="100vw"
                alt={item.title}
              />
            </div>
            <div className="p-2">
              <div className="flex justify-end pt-1">
                {/* @ts-expect-error expected error due to type mismatch */}
                <Link href={`/store/${item.store.slug}`} className="capitalize font-normal text-xs text-gray-500 whitespace-nowrap text-ellipsis overflow-hidden">
                  <i className="fa-solid fa-store mr-1"></i>
                 {/* @ts-expect-error expected error due to type mismatch */}
                  {item.store.name}
                </Link>

              </div>
              <p className="text-[#16171a] font-normal text-sm my-1 capitalize line-clamp-3">{item.title}</p>
              <div className="pt-2">
                <span>
                  <strong className="text-primary text-lg mr-2 sm:text-xl sm:mr-3 mb-1">
                    ₹{item?.offer_price.toString()}/-
                  </strong>
                  <small className="text-red-500 text-nowrap text-[12px] sm:text-sm py-.5 px-2 border-[1px] border-red-400 ">
                    ₹{item?.calculated_cashback.toString()} Off
                  </small>
                </span>
                <div className="flex justify-between mt-2 mb-1 items-center ">
                  <span className="text-gray-600 text-base font-medium line-through">
                    ₹{item?.actual_price.toString()}
                  </span>
                <button
  className="select-none rounded-full bg-gradient-to-r from-red-500 via-pink-500 to-red-600 text-white text-center font-semibold py-2 px-5 text-sm shadow-md hover:scale-105 hover:shadow-lg transition-all duration-300 ease-in-out"
>
   Grab Now
</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {wishlist.length === 0 && (
        <div className="text-center py-12">
          <p className="text-base text-gray-600 mb-3">No products in your wishlist.</p>
          <Link
            href="/campaign"
            className="text-primary hover:text-blue-500 text-sm hover:underline"
          >
            Explore more campaigns
          </Link>
        </div>
      )}
    </>
  );
};

export default Wishlist_client;
