/* eslint-disable @typescript-eslint/no-explicit-any */
import BottomToTop from "@/components/BottomToTop";
import Footer from "@/components/Footer";
import MainHeader from "@/components/header/MainHeader";
import { getServerToken } from "@/helpers/server/server_function";
import { list_store_api } from "@/utils/api_url";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import StoreClient from "./store_client";
import { FaStore } from "react-icons/fa";
import { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Cashback Stores - Save Money on Online Shopping | BachatJar',
  description: 'Discover top online stores offering cashback. Save money on your shopping with exclusive cashback offers from popular brands at BachatJar.',
  keywords: 'cashback stores, online shopping, cashback offers, shopping deals, BachatJar stores',
  openGraph: {
    title: 'Cashback Stores - Best Online Shopping Deals',
    description: 'Shop from top online stores and earn cashback. Find exclusive cashback offers from your favorite brands at BachatJar.',
    url: 'https://bachatjar.com/store',
    siteName: 'BachatJar',
    images: [
      {
        url: '/stores-og.jpg',
        width: 1200,
        height: 630,
        alt: 'BachatJar Cashback Stores',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Cashback Stores | BachatJar',
    description: 'Shop and earn cashback from top online stores at BachatJar.',
    images: ['/stores-twitter.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    'max-snippet': -1,
    'max-image-preview': 'large',
    'max-video-preview': -1,
  },
  alternates: {
    canonical: 'https://bachatjar.com/store',
  },
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
 const GetData = async (token: string) => {
  try {
    const { data } = await axios.post(list_store_api,{store_status:"ACTIVE"}, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return data.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Error registering user", error.response?.data.message);
      toast.error(error.response?.data.message);
    } else {
      console.error("Unknown error", error);
    }
  }
};

                                                    
export default async function Stores() {
  const token = await getServerToken();
  const page_data = await GetData(token);

  // Create stores list schema
  const storesListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": page_data?.map((store: any, index: number) => ({
      "@type": "Organization",
      "position": index + 1,
      "name": store.name,
      "description": store.description?.replace(/<[^>]*>?/gm, ''),
      "url": `https://bachatjar.com/store/${store.slug}`,
      "logo": store.store_img,
      "offers": {
        "@type": "Offer",
        "description": `Up to ${store.cashback_type === "FLAT_AMOUNT" ? `₹${store.cashback_rate}` : `${store.cashback_rate}%`} cashback`,
      }
    })) || []
  };

  // Create breadcrumb schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://bachatjar.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Stores",
        "item": "https://bachatjar.com/store"
      }
    ]
  };

  return (
    <>
      <Script
        id="stores-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(storesListSchema) }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <MainHeader />
      <main>
        <div className="max-w-6xl px-2 m-auto mt-4 lg:mt-5 mb-16">
        <div className="flex justify-center items-center h-[130px] sm:h-[200px]">
          <h1 className=" text-3xl md:text-5xl uppercase text-secondary flex gap-3 font-medium">CashBack <span className="text-primary ">Store </span> <FaStore className="text-primary" /></h1>
        </div>
          <StoreClient page_data={page_data} />
        </div>
        <BottomToTop />
      </main>
      <Footer />
    </>
  );
}
