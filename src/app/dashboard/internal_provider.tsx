"use client";

import { RootState } from "@/redux-store/redux_store";
import React, { ReactNode } from "react";
import { useSelector } from "react-redux";
import { notFound } from "next/navigation";

interface InternalProviderProps {
  children: ReactNode;
}

export const InternalProvider: React.FC<InternalProviderProps> = ({ children }) => {
  const user_data = useSelector((state: RootState) => state.user.user);

  if (!user_data) {
    return notFound(); 
  }

  if (
    user_data.role !== "admin" &&
    user_data.role !== "data_editor" &&
    user_data.role !== "blog_editor"
  ) {
    return notFound(); 
  }

  return <>{children}</>;
};
