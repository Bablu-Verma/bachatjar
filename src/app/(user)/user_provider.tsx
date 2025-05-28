"use client";

import { RootState } from "@/redux-store/redux_store";
import React, { ReactNode, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

interface UserProviderProps {
  children: ReactNode;
}

const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const token = useSelector((state: RootState) => state.user.token);
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push('/login');
    }
  }, [token, router]); 

  if (token) {
    return <>{children}</>;
  }

  return null;
};

export default UserProvider;
