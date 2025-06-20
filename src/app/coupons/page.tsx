/* eslint-disable @typescript-eslint/no-explicit-any */
import BottomToTop from "@/components/BottomToTop";
import Footer from "@/components/Footer";
import MainHeader from "@/components/header/MainHeader";
import { getServerToken } from "@/helpers/server/server_function";
import { coupons_list_api } from "@/utils/api_url";
import { RiCoupon3Fill } from "react-icons/ri";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import CouponClient from "./Coupon_Client";
import { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Best Coupons & Promo Codes | BachatJar',
  description: 'Find the latest coupons, promo codes and deals from top brands. Save money on your online shopping with exclusive offers from BachatJar.',
  keywords: 'coupons, promo codes, deals, discount codes, online shopping, BachatJar coupons',
  openGraph: {
    title: 'Latest Coupons & Promo Codes - BachatJar',
    description: 'Discover exclusive coupons and promo codes from top brands. Save big on your online shopping with BachatJar.',
    url: 'https://bachatjar.com/coupons',
    siteName: 'BachatJar',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'BachatJar Coupons and Promo Codes',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Coupons & Promo Codes',
    description: 'Find the latest coupons and promo codes from top brands at BachatJar.',
    images: ['/twitter-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    'max-snippet': -1,
    'max-image-preview': 'large',
    'max-video-preview': -1,
  },
  alternates: {
    canonical: 'https://bachatjar.com/coupons',
  },
};

 const GetData = async (token: string) => {
  try {
    const { data } = await axios.post(
      coupons_list_api,
      {
       
      },
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );

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

export default async function Category() {
  const token = await getServerToken();
  const page_data = await GetData(token);

  // Create coupons list schema
  const couponsListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": page_data?.map((coupon: any, index: number) => ({
      "@type": "Offer",
      "position": index + 1,
      "name": coupon.title,
      "description": coupon.description?.replace(/<[^>]*>?/gm, ''),
      "url": `https://bachatjar.com/coupons/${coupon._id}`,
      "seller": {
        "@type": "Organization",
        "name": coupon.store_details?.name,
        "image": coupon.store_details?.store_img
      },
      "validFrom": coupon.start_date,
      "validThrough": coupon.end_date,
      "availability": "https://schema.org/InStock"
    })) || []
  };

  // Create BreadcrumbList schema
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
        "name": "Coupons",
        "item": "https://bachatjar.com/coupons"
      }
    ]
  };

  return (
    <>
      <Script
        id="coupons-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(couponsListSchema) }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <MainHeader />
      <main>
        <div className="max-w-6xl  px-2 m-auto mt-4 lg:mt-8 mb-16">
          <div className="flex justify-center items-center h-[130px] sm:h-[200px]">
            <h1 className="text-3xl md:text-5xl uppercase text-secondary flex gap-3 font-medium">Best <span className="text-primary ">Coupons </span> <RiCoupon3Fill className="text-primary" /></h1>
          </div>
        <CouponClient coupons={page_data} />
        </div>
        <BottomToTop />
      </main>
      <Footer />
    </>
  );
}
