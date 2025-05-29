"use client";

import CouponcodeCard from "@/components/small_card/CouponcodeCard";
import ProductCard from "@/components/small_card/ProductCard";
import StoreCard from "@/components/small_card/StoreCard";
import { ICampaign } from "@/model/CampaignModel";
import { ICoupon } from "@/model/CouponModel";
import { IStore } from "@/model/StoreModel";
import { RootState } from "@/redux-store/redux_store";
import { category_details_api } from "@/utils/api_url";
import axios, { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";


interface CAProps {
  relatedCoupons: ICoupon[];
  relatedProducts: ICampaign[];
  relatedStore: IStore[];
  slug: string
}

const CategoryClientTab: React.FC<CAProps> = ({ slug, relatedProducts, relatedCoupons, relatedStore }) => {
  const [openTab, setOpenTab] = useState("Product");
  const [page, setPage] = useState(1);
  const [Coupons, setSetCoupons] = useState<ICoupon[]>(relatedCoupons);
  const [Product, setProduct] = useState<ICampaign[]>(relatedProducts);
  const [Stores, setStores] = useState<IStore[]>(relatedStore);

  const token = useSelector((state: RootState) => state.user.token);


  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getCoupon = async () => {
    try {
      const { data } = await axios.post(
        category_details_api,
        { slug, page, tabtype: openTab },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // console.log(data.data)

      if (openTab === "Product") {
        setProduct([...Product, ...data.data.relatedProducts]);
      } else if (openTab === "Coupons") {
        setSetCoupons([...Coupons, ...data.data.relatedCoupons]);
      } else if (openTab === "Store") {
        setStores([...Stores, ...data.data.relatedStore]);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error fetching deals:", error.response?.data.message);
      } else {
        console.error("Unknown error", error);
      }
    }
  };

  useEffect(() => {
    if (page > 1) getCoupon();
  }, [getCoupon, page]);

  return (
    <div className="mt-16">
      <div className="grid grid-cols-3 gap-[1px] mb-10 rounded-md overflow-hidden">
        <button
          type="button"
          onClick={() => {
            setOpenTab("Product")
            setPage(1)
          }}
          className={` ${openTab == "Product" ? 'bg-gray-600' : 'bg-gray-300'} py-1.5 text-white capitalize text-center text-lg`}
        >
          Product
        </button>
        <button
          type="button"
          onClick={() => {
            setOpenTab("Coupons")
            setPage(1)
          }}
          className={` ${openTab == "Coupons" ? 'bg-gray-600' : 'bg-gray-300'} py-1.5 text-white capitalize text-center text-lg`}
        >
          Coupons
        </button>
        <button
          type="button"
          onClick={() => {
            setOpenTab("Store")
            setPage(1)
          }}
          className={` ${openTab == "Store" ? 'bg-gray-600' : 'bg-gray-300'} py-1.5 text-white capitalize text-center text-lg`}
        >
          Store
        </button>

      </div>
      {openTab == "Product" &&
        Product &&
        Product.length > 0 && (
          <div className="grid grid-rows-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
            {Product.map((item, i) => {
              return <ProductCard card_data={item} key={i} />;
            })}
          </div>
        )}
      {openTab == "Coupons" && relatedCoupons && relatedCoupons.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {Coupons.map((item, i) => {
            return <CouponcodeCard item={item} key={i}/>;
          })}
        </div>
      )}
      {openTab == "Store" && relatedStore && relatedStore.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-8 mt-6 lg:mt-10">
          {Stores.map((item, i) => {
            return <StoreCard item={item} key={i}/>;
          })}
        </div>
      )}

      <div className="flex justify-center items-center pt-10 ">
        <button
          onClick={() => setPage(page + 1)}
          className="text-sm py-2 px-8 transition-all duration-300 ease-in-out rounded-full border-2 border-primary text-white bg-primary"
        >
          More {openTab === 'Coupons' ? 'Coupon' : openTab === 'Store' ? 'Store' : 'Product'}
        </button>
      </div>
    </div>
  );
};

export default CategoryClientTab;
