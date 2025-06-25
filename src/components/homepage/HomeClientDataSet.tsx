"use client";


import { ICampaign } from "@/model/CampaignModel";
import { IMessage } from "@/model/Message";
import { setNotifications } from "@/redux-store/slice/notificationSlice";
import { addItem } from "@/redux-store/slice/wishlistSlice";

import  { useEffect } from "react";
import { useDispatch } from "react-redux";

interface IClientDataSet {
 watchlist :ICampaign,
 notification:IMessage
}

const HomeClientDataSet:React.FC<IClientDataSet> = ({watchlist, notification}) => {
  const dispatch = useDispatch();


  
  
  useEffect(() => {
    dispatch(addItem(watchlist));
    dispatch(setNotifications(notification))
  }, [dispatch]);

  return null;
};

export default HomeClientDataSet;
