"use client";

import React, { ReactNode } from "react";
import store_ from "./redux_store";
import { Provider } from 'react-redux';

interface ReduxProviderProps {
  children: ReactNode;
}

const ReduxProvider: React.FC<ReduxProviderProps> = ({ children }) => {
  return <Provider store={store_}>{children}</Provider>
};

export default ReduxProvider;