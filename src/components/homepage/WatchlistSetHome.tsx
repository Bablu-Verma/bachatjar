"use client";


import { ICampaign } from "@/model/CampaignModel";
import { addItem } from "@/redux-store/slice/wishlistSlice";

import  { useEffect } from "react";
import { useDispatch } from "react-redux";

interface IWatchliat {
 watchlist :ICampaign
}

const WatchlistSetHome:React.FC<IWatchliat> = ({watchlist}) => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(addItem(watchlist));
  }, [dispatch]);

  return null;
};

export default WatchlistSetHome;
