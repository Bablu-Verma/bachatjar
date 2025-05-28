"use client";

import { RootState } from "@/redux-store/redux_store";
import { addItem } from "@/redux-store/slice/wishlistSlice";
import { wishlist_list_get_ } from "@/utils/api_url";
import axios, { AxiosError } from "axios";
import  { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const CallApiInHome = () => {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.user.token);
  const getWishlist = async () => {
    try {
      const { data } = await axios.post(
        wishlist_list_get_,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(addItem(data.data.products));
      console.log(data.data.products);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error ", error.response?.data.message);
      } else {
        console.error("Unknown error", error);
      }
    }
  };

  useEffect(() => {
    if (token) {
      setTimeout(() => {
        getWishlist();
      }, 2000);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return null;
};

export default CallApiInHome;
