/* eslint-disable @next/next/no-page-custom-font */
import type { Metadata } from "next";
import { Toaster } from 'react-hot-toast';
import "./globals.css";
import './dangerouslyHTML.css'
import ReduxProvider from "@/redux-store/provider_";

import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';


export const metadata: Metadata = {
  title: "BachatJar – Cashback, Coupons & Promo Codes | Save Big on Every Online Purchase in India",
  description: 'Shop online & earn real cashback on every purchase. Get latest discount coupons, promo codes & exclusive offers only at BachatJar',
  keywords: 'Cashback website India, Best cashback offers, Online shopping cashback, Discount coupons India, Promo codes Flipkart/Amazon, savings,Earn money shopping online, BachatJar,Real cashback deals, Top cashback sites in India ',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    
<html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap"
          rel="stylesheet"
        />
     
      </head>
      <body className="font-roboto antialiased bg-highlight_color">
       <Toaster  position="top-right" />
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
   
    
  );
}
