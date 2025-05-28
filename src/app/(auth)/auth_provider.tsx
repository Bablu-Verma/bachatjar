"use client";

import { RootState } from "@/redux-store/redux_store";
import React, { ReactNode, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const token = useSelector((state: RootState) => state.user.token);
  const router = useRouter();

  useEffect(() => {
    if (token) {
      router.push('/');
    }
  }, [token, router]); 

  return <>{children}</>;
};

export default AuthProvider;
