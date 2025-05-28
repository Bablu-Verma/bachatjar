import BottomToTop from "@/components/BottomToTop";
import Footer from "@/components/Footer";
import MainHeader from "@/components/header/MainHeader";


import { getServerToken } from "@/helpers/server/server_function";
import { wishlist_list_get_ } from "@/utils/api_url";
import axios, { AxiosError } from "axios";
import React from "react";
import toast from "react-hot-toast";
import Wishlist_client from "./_wishlist_client";
import Wishlist_remove from "./_wishlist_remove";

export const GetData = async (token: string) => {
  try {
    const { data } = await axios.post(
      wishlist_list_get_,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return data.data;

  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Error get wishlist", error.response?.data.message);
      toast.error(error.response?.data.message);
    } else {
      console.error("Unknown error", error);
    }
  }
};

const Wishlist = async () => {
  const token = await getServerToken();

  const page_data = await GetData(token);

  const wishlist_products = page_data.products;

  return (
    <>

      <MainHeader />
      <main className="min-h-screen">
        <div className="max-w-6xl  mx-auto px-4 flex mt-7 md:mt-10 justify-end items-end mb-4 relative">

          <Wishlist_remove id={page_data?.wishlist_id} />
        </div>
        <div className="max-w-6xl mx-auto px-2 ">
          <Wishlist_client item_={wishlist_products} />
          </div>
        <BottomToTop />
      </main>
      <Footer />
    </>
  );
};

export default Wishlist;
