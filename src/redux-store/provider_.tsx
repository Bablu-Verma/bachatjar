"use client";

import React, { ReactNode, useEffect } from "react";
import { Provider } from "react-redux";
import store_ from "./redux_store";
import Script from "next/script";
import { usePathname } from "next/navigation";
import ChatWidget from "@/components/ChatWidget";

interface ReduxProviderProps {
  children: ReactNode;
}

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

const ReduxProvider: React.FC<ReduxProviderProps> = ({ children }) => {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window.gtag !== "function") return;
    window.gtag("config", GA_MEASUREMENT_ID!, {
      page_path: pathname,
    });
  }, [pathname]);





  return (
    <Provider store={store_}>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
      <ChatWidget />
      {children}
    </Provider>
  );
};

export default ReduxProvider;
