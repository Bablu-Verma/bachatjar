"use client";

import { RootState } from "@/redux-store/redux_store";
import React from "react";
import toast from "react-hot-toast";

import { useSelector } from "react-redux";
import { IoMdShare } from "react-icons/io";
import { FaExternalLinkAlt } from "react-icons/fa";
import { IStore } from "@/model/StoreModel";



interface UserStoreActionProps {
  store_: IStore;
}

const UserStoreAction: React.FC<UserStoreActionProps> = ({ store_ }) => {
  const token = useSelector((state: RootState) => state.user.token);
  const user = useSelector((state: RootState) => state.user.user);

  

  const shop_now = async () => {
    if (!token) {
      toast.error("You need to login to proceed");

      setTimeout(() => {
        window.location.href = "/login";
      }, 5000);

      return;
    }

   
   const storeId = store_._id;
   window.open(`/create-order?store_id=${storeId}`, '_blank');


    
  };


  const create_share_link = ()=> {
    if (!token) {
      toast.error("You need to login to proceed");

      setTimeout(() => {
        window.location.href = "/login";
      }, 5000);

      return;
    }

    const create_link = `${process.env.NEXT_PUBLIC_SITE_URL}/create-share-order?store_id=${store_._id}&user_id=${user?._id}`

    navigator.clipboard
    .writeText(create_link)
    .then(() => {
      toast.success("Link copied to clipboard!");
    })
    .catch((err) => {
      console.error("Failed to copy: ", err);
      toast.error("Failed to copy link. Please try again.");
    });
    
  }



  return (
    <>
      <div className="flex justify-center items-center gap-6">
        <a
          onClick={shop_now}
          className="border-[1px] cursor-pointer justify-center items-center gap-2 inline-flex text-base rounded px-6 py-2 text-white "
        >
          <span> {
            store_.store_type != 'NON_INSENTIVE' ? 'Shop & Earn': 'Shop & Save'
            } </span>
          <FaExternalLinkAlt />
        </a>
        {
          store_.store_type != 'NON_INSENTIVE' &&  <button
          type="button"
          onClick={create_share_link}
          className=" justify-center items-center gap-2 text-base border-[1px] border-green-400 text-secondary inline-flex px-6 py-2 bg-green-400 rounded"
        >
          <span>Share Link</span>
          <IoMdShare className="text-lg" />
        </button>
        }
       
      </div>
    </>
  );
};

export default UserStoreAction;
