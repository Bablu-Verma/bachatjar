"use client"

import { ICampaign } from '@/model/CampaignModel';
import { RootState } from '@/redux-store/redux_store';
import { addOne } from '@/redux-store/slice/wishlistSlice';
import { wishlist_add_ } from '@/utils/api_url';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';


interface IWAadProps {
  oneitem: ICampaign;
}

const Watchlistadd:React.FC<IWAadProps> = ({oneitem}) => {
  const [isAdding, setIsAdding] = useState(false); 
  const token = useSelector((state: RootState) => state.user.token);
  const wishlist = useSelector((state:RootState) => state.wishlist.items);
 const dispatch = useDispatch()


//  console.log(wishlist)

//  console.log(oneitem)

  const isInWishlist = wishlist.some((item) => item._id === oneitem._id)

  const router = useRouter();

  const add_list = async () => {
    if (!token) {
       return router.push('/login');
    }

    if (isAdding) return; 
    setIsAdding(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); 
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { data } = await axios.post(
        wishlist_add_,
        {
          product_id:oneitem._id
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(addOne(oneitem))
      toast.success('Added to wishlist successfully!');
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error("Error ", error.response?.data.message);
            toast.error(error.response?.data.message);
          } else {
            console.error("Unknown error", error);
          }
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <button
      onClick={add_list}
      title={token ? "Add to Wishlist" : "Login to Add Wishlist"}
      aria-label="Add to Wishlist"
      role="button"
      disabled={isAdding}
      className={`py-2 px-5 text-center text-secondary outline-none border-none duration-200`}
    >
      <i
        className={`fa-heart text-2xl mr-1 ${
          isInWishlist ? "fa-solid text-red-500" : "fa-regular"
        }`}
      ></i>
      {isInWishlist ? <i className="fa-solid fa-check text-sm text-red-500"></i> : <i className="fa-solid fa-plus text-sm"></i>}
    </button>
  );
};

export default Watchlistadd;
