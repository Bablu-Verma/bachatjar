"use client";

import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios"; // Import Axios
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
import { ICategory } from "@/model/CategoryModel";
import CategorieCard from "@/components/small_card/CategorieCard";

export default function SearchPage() {
  const [query, setQuery] = useState<string>(""); // Explicit typing for better readability
  const [debouncedQuery, setDebouncedQuery] = useState<string>("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [resultProduct, setResultProduct] = useState<any[]>([]); // Add typing based on actual API response
  const [resultCategory, setResultCategory] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null); // Use null for no error state

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
      setError(null); // Reset error state before API call

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

      if (!data.data.categories.length && !data.data.campaigns.length) {
        setError("No results found.");
        setResultProduct([]);
        setResultCategory([]);
        return;
      }

      setResultProduct(data.data.campaigns || []);
      setResultCategory(data.data.categories || []);
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
      setResultCategory([]);
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

        <div className="flex justify-center items-center lg:mt-20">
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
            <div className="px-2 lg:px-4 flex mt-7 md:mt-10 justify-start items-end mb-4 relative">
              <MainHeading title="Products" link={null} />
            </div>
            <div className="px-2 lg:px-4 pt-2 grid grid-rows-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-4 gap-3 md:gap-6">
              {resultProduct.map((item, i) => (
                <ProductCard card_data={item} key={i} />
              ))}
            </div>
          </>
        )}

        {resultCategory.length > 0 && (
          <>
            <div className="px-4 flex mt-7 md:mt-10 justify-start items-end mb-4 relative">
              <MainHeading title="Category" link={null} />
            </div>
            <div className="px-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 pb-10 pt-2">
              {resultCategory.map((item: ICategory,i) => (
                <CategorieCard item={item} key={i} />
              ))}
            </div>
          </>
        )}

        <BottomToTop />
      </main>
      <Footer />
    </>
  );
}
