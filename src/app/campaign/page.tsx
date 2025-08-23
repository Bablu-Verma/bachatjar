"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { product_list_ } from "@/utils/api_url";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/redux_store";

import { ICampaignWithStore } from "@/common_type";
import ProductCard from "@/components/small_card/ProductCard";
import SimpleLoader from "@/components/SimpleLoader";
import Footer from "@/components/Footer";
import BottomToTop from "@/components/BottomToTop";
import MainHeader from "@/components/header/MainHeader";
import Campaign_Store from "./campaign_store";
import Campaign_Category from "./campaign_category";
import { FaFilter, FaTimes } from "react-icons/fa";

const Deals: React.FC = () => {
  const [openTab, setOpenTab] = useState<string>("all");
  const [page, setPage] = useState<number>(1);
  const [deals, setDeals] = useState<ICampaignWithStore[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [storeid, setStoreId] = useState('')
  const [categoryid, setcategoryId] = useState('')
  const [showfilter, setFilter] = useState(false)



  // 🔥 New states for filters
  const [sortPrice, setSortPrice] = useState<string>(""); // low, high
  const [sortDate, setSortDate] = useState<string>("latest"); // latest, oldest

  const token = useSelector((state: RootState) => state.user.token);

  const tabOptions = [
    { name: "Our Offers", tag: "all" },
    { name: "Hot Deals", tag: "hot" },
    { name: "Live", tag: "live" },
    { name: "100% Free", tag: "free" },
  ];

  // ---------------- Fetch Deals ----------------
  const getDeals = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        product_list_,
        { page, tag: openTab, sortPrice, sortDate, storeid, categoryid }, // pass filters
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      let newDeals: ICampaignWithStore[] = data?.data || [];

      // Local filter for "Free"
      if (openTab === "free") {
        newDeals = newDeals.filter((d) => d.offer_price === 0);
      }

      if (newDeals.length === 0) setHasMore(false);
      setDeals((prev) => [...prev, ...newDeals]);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error fetching deals:", error?.response?.data?.message || error.message);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };



  // Reset when tab/filter changes
  useEffect(() => {
    setDeals([]);
    setHasMore(true);
    setPage(1);
  }, [openTab, sortPrice, sortDate, storeid, categoryid]);

  useEffect(() => {
    getDeals();
  }, [page, openTab, sortPrice, sortDate, storeid, categoryid]);


useEffect(() => {
    // function banate hain jo screen width check kare
    const handleResize = () => {
      if (window.innerWidth > 640) {
        setFilter(true);
      } else {
        setFilter(false);
      }
    };

    // initial check (component mount hote hi run ho)
    handleResize();

    // resize event listener add karo
    window.addEventListener("resize", handleResize);

    // cleanup on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  const handleTabChange = (tag: string) => {
    if (tag !== openTab) {
      setOpenTab(tag);
    }
  };

  return (
    <>
      <MainHeader />
      <div className="min-h-screen px-2 sm:grid grid-cols-7  pb-32 max-w-6xl mx-auto gap-3 pt-8 lg:pt-10 relative">
        {
          showfilter && <div className="col-span-2 overflow-auto h-screen  sm:h-auto pt-20 sm:overflow-visible z-20 left-0 right-0 p-4 sm:p-0 fixed top-0 sm:relative  bg-white sm:bg-transparent">

           <button
                onClick={() => setFilter(false)}
                className={`text-sm py-1 flex sm:hidden gap-2 items-center px-6 transition-all duration-300 ease-in-out rounded-full border-2 border-primary text-nowrap text-primary bg-white"
                  }`}
              >
                <FaTimes className="text-md" />
              </button>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 py-4">
              {/* Price Sorting */}
              <select
                value={sortPrice}
                onChange={(e) => {
                   setSortPrice(e.target.value)
                   
                }}
                className="block appearance-none rounded-xl border border-gray-300 bg-white w-full px-4 py-2 pr-10 text-gray-900 shadow-sm
             focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/5"
              >
                <option value="">Sort by Price</option>
                <option value="low">Low to High</option>
                <option value="high">High to Low</option>
              </select>

              {/* Date Sorting */}
              <select
                value={sortDate}
                onChange={(e) => {
                  setSortDate(e.target.value)
                  
                }}
                className="block appearance-none rounded-xl border border-gray-300 bg-white px-4 py-2 pr-10 text-gray-900 shadow-sm
             focus:border-primary focus:outline-none w-full focus:ring-2 focus:ring-primary/5"
              >
                <option value="latest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>


            </div>

            <div>
              <Campaign_Store  setStoreId={setStoreId} />
              <Campaign_Category setcategoryId={setcategoryId} />
            </div>

          </div>
        }

        <div className="col-span-5">
          {/* Tabs */}
          <div className="flex px-2 filter_ justify-start overflow-auto items-center pt-4 pb-2 gap-2 sm:gap-6">
             <button
               
                onClick={() => setFilter(true)}
                className={`text-sm py-1 flex sm:hidden gap-2 items-center px-6 transition-all duration-300 ease-in-out rounded-full border-2 border-primary text-nowrap text-primary bg-white"
                  }`}
              >
               Filter <FaFilter className="text-md" />
              </button>
            {tabOptions.map((item) => (
              <button
                key={item.tag}
                onClick={() => handleTabChange(item.tag)}
                className={`text-sm py-1 px-6 transition-all duration-300 ease-in-out rounded-full border-2 border-primary text-nowrap ${openTab === item.tag ? "text-white bg-primary" : "text-primary bg-white"
                  }`}
              >
                {item.name}
              </button>
            ))}
          </div>
          {/* Deals Grid */}
          <div className="grid  grid-cols-2 pt-2 md:grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-3">
            {deals.map((item) => (
              <ProductCard key={item._id} card_data={item} />
            ))}
          </div>

          {/* Load More */}
          <div className="flex justify-center items-center pt-5">
            {hasMore ? (
              <button
                onClick={() => setPage((prev) => prev + 1)}
                className="text-sm w-36 py-2 px-8 transition-all duration-300 ease-in-out rounded-full border-2 border-primary hover:border-white text-white bg-primary flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? <SimpleLoader /> : "More Deals"}
              </button>
            ) : (
              <span className="text-gray-500 text-sm">No more deals</span>
            )}
          </div>
        </div>

      </div>
      <BottomToTop />
      <Footer />
    </>
  );
};

export default Deals;
