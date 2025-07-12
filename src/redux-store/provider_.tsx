"use client";

import React, { ReactNode, useEffect } from "react";
import { Provider } from "react-redux";
import store_ from "./redux_store";
import Script from "next/script";
import { usePathname } from "next/navigation";

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

  useEffect(() => {
    const interval = setInterval(() => {
      if (typeof window !== "undefined" && window.$crisp?.push) {
        if (pathname === "/") {
          window.$crisp.push(["do", "chat:show"]);
        } else {
          window.$crisp.push(["do", "chat:hide"]);
        }
        clearInterval(interval);
      }
    }, 300);

    return () => clearInterval(interval);
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
     <Script
  id="crisp-chat"
  strategy="afterInteractive"
  dangerouslySetInnerHTML={{
    __html: `
      window.$crisp = [];
      window.CRISP_WEBSITE_ID ="a03e3ba7-7ab2-4dea-b533-fb294da0919c";
      (function() {
        var d = document;
        var s = d.createElement("script");
        s.src = "https://client.crisp.chat/l.js";
        s.async = 1;
        d.getElementsByTagName("head")[0].appendChild(s);
      })();
    `,
  }}
/>
      {children}
    </Provider>
  );
};

export default ReduxProvider;
