"use client"


import { RootState } from '@/redux-store/redux_store'
import { clearWishlist } from '@/redux-store/slice/wishlistSlice'
import { wishlist__remove_ } from '@/utils/api_url'
import axios, { AxiosError } from 'axios'
import React from 'react'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'

interface IWRProps {
  id:string
}

const Wishlist_remove:React.FC<IWRProps> = () => {
  const token = useSelector((state: RootState) => state.user.token);
  const dispatch = useDispatch();
  const remover_wishlist = async ()=>{
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { data } = await axios.post(
        wishlist__remove_,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      toast.success("Clear All Product successfully!");
      dispatch(clearWishlist());
      
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error Product remove ", error.response?.data.message);
        toast.error(error.response?.data.message);
      } else {
        console.error("Unknown error", error);
        toast.error("Failed to Product remove. Please try again.");
      }
    }

  }

  return (
    <button onClick={remover_wishlist} className="text-blue-500 underline hover:text-red-400 capitalize font-normal text-sm ">
    Remove all 
  </button>
  )
}

export default Wishlist_remove

