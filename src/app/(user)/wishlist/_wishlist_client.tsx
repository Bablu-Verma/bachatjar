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
      const { data } = await axios.post(
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
          // console.log(item),
          <div key={i} className="bg-white border-[1px] rounded overflow-hidden border-gray-300 ">
            <div className='relative '>
              <button
                className="text-red-400 absolute right-1 top-1 p-1 hover:text-red-700"
                title="Remove this item"
                onClick={() => remover_data(item._id ?? 0)}
              >
                <i className="fa-solid fa-trash text-base"></i>
              </button>
              <Image
                src={item.product_img}
                className="h-28 w-full"
                width={100}
                height={100}
                sizes="100vw"
                alt={item.title}
              />
            </div>
            <div className="p-2">
              <div className="flex justify-end pt-1">
                <Link href={`/store/${item.store.slug}`} className="capitalize font-normal text-xs text-gray-500 whitespace-nowrap text-ellipsis overflow-hidden">
                  <i className="fa-solid fa-store mr-1"></i>
                  {/* <i className="fa-solid fa-shop mr-1"></i> */}
                  {item.store.name}
                </Link>

              </div>
              <p className="text-[#16171a] font-normal text-sm my-1 capitalize line-clamp-3">{item.title}</p>
              <div className="pt-2">
                <span>
                  <strong className="text-primary text-lg mr-2 sm:text-xl sm:mr-3 mb-1">
                    ₹{item?.offer_price.toString()}/-
                  </strong>
                  {/* <small className="text-red-500 text-nowrap text-[12px] sm:text-sm py-.5 px-2 border-[1px] border-red-400 ">
                    ₹{item?.calculated_cashback.toString()} Off
                  </small> */}
                </span>
                <div className="flex justify-between mt-2 mb-1 items-center ">
                  <span className="text-gray-600 text-base font-medium line-through">
                    ₹{item?.actual_price.toString()}
                  </span>
                  <button
                    className="select-none pr-1 rounded-md text-[#2491ef] font-medium py-1 text-sm duration-200 text-nowrap ease-in-out "
                  > Grab Now </button>
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
