"use client";

import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import BottomToTop from "@/components/BottomToTop";
import Footer from "@/components/Footer";
import MainHeader from "@/components/header/MainHeader";
import toast from "react-hot-toast";
import { search_client_ } from "@/utils/api_url";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";
import { BallTriangle } from "react-loader-spinner";
import ProductCard from "@/components/small_card/ProductCard";
import { MainHeading } from "@/components/Heading";

import { IStore } from "@/model/StoreModel";
import { ICoupon } from "@/model/CouponModel";
import CouponcodeCard from "@/components/small_card/CouponcodeCard";
import StoreCard from "@/components/small_card/StoreCard";
import { IReferral } from "@/model/ReferralModel";
import ReferralCard from "@/components/small_card/ReferralCard";

export default function SearchPage() {
  const [query, setQuery] = useState<string>("");
  const [debouncedQuery, setDebouncedQuery] = useState<string>("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [resultProduct, setResultProduct] = useState<any[]>([]);
  const [resultStore, setResultStore] = useState<IStore[]>([]);
  const [resultCoupons, setResultCoupons] = useState<ICoupon[]>([]);
  const [resultReferral, setResultReferral] = useState<IReferral[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const token = useSelector((state: RootState) => state.user.token);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  const search_query = async (debouncedQuery: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await axios.post(
        search_client_,
        { query: debouncedQuery },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
// console.log(data.data)
      if (!data.data.stores.length && !data.data.campaigns.length && !data.data.coupons.length && !data.data.referral.length) {
        setError("No results found.");
        setResultProduct([]);
        setResultStore([])
        setResultCoupons([])
        setResultReferral([])
        return;
      }
      // console.log("data.data", data.data)
      setResultProduct(data.data.campaigns || []);
      setResultStore(data.data.stores || []);
      setResultCoupons(data.data.coupons || []);
      setResultReferral(data.data.referral ||[])

    } catch (err) {
      if (err instanceof AxiosError) {
        console.error("Error fetching search results", err.response?.data.message);
        toast.error(err.response?.data.message || "An error occurred");
      } else {
        console.error("Unknown error", err);
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (debouncedQuery) {
      search_query(debouncedQuery);
    } else {
      setResultProduct([]);
      setResultStore([])
      setResultCoupons([])
       setResultReferral([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  return (
    <>
      <MainHeader />
      <main className="max-w-6xl  mx-auto relative min-h-screen">
        <div className="flex items-center justify-center py-4 lg:py-10">
          <div className="relative w-[50%] min-w-[350px] rounded-sm overflow-hidden">
            <input
              type="text"
              id="search"
              name="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
              placeholder="What are you looking for"
              className="w-full bg-gray-200 py-1.5 px-3 pr-6 outline-none border-gray-200 focus:border-l-primary text-sm font-normal text-gray-950 border-2"
            />
            <button type="submit" className="absolute right-2 top-[6px]">
              <i className="fa-solid fa-search"></i>
            </button>
          </div>
        </div>

        <div className="flex justify-center items-center ">
          {loading && (
            <BallTriangle
              height={100}
              width={100}
              radius={5}
              color="#4fa94d"
              ariaLabel="ball-triangle-loading"
              visible={true}
            />
          )}
          {error && <div className="text-secondary text-sm">{error}</div>}
        </div>

        {resultProduct.length > 0 && (
          <>
            <div className="px-2 lg:px-4  mt-7  mb-4 relative">
              <MainHeading title="Products" link={null} />
            </div>
            <div className="px-2 lg:px-4 pt-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-4 gap-3 md:gap-6">
              {resultProduct.map((item, i) => (
                <ProductCard card_data={item} key={i} />
              ))}
            </div>
          </>
        )}

        {resultStore.length > 0 && (
          <>
            <div className="px-2 lg:px-4  mt-7  mb-4 relative">
              <MainHeading title="Stores" link={null} />
            </div>
            <div className="px-2 lg:px-4 pt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4  gap-3 md:gap-6">
              {resultStore.map((store, i) => (
                 <StoreCard item={store} key={i} />
              ))}
            </div>
          </>
        )}

        {resultCoupons.length > 0 && (
          <>
            <div className="px-2 lg:px-4  mt-7  mb-4 relative">
              <MainHeading title="Coupons" link={null} />
            </div>
            <div className="px-2 lg:px-4 pt-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
              {resultCoupons.map((coupon, i) => (
                <CouponcodeCard item={coupon} key={i} />
              ))}
            </div>
          </>
        )}
        {resultReferral.length > 0 && (
          <>
            <div className="px-2 lg:px-4  mt-7  mb-4 relative">
              <MainHeading title="Referral" link={null} />
            </div>
            <div className="px-2 lg:px-4 pt-2 grid grid-cols-2  md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
              {resultReferral.map((item, i) => (
                    <ReferralCard key={i} item={item} />
              ))}
            </div>
          </>
        )}


   <div className="py-10"></div>



        <BottomToTop />
      </main>
      <Footer />
    </>
  );
}
