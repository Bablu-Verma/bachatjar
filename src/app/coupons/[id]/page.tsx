/* eslint-disable @typescript-eslint/no-explicit-any */
import BottomToTop from "@/components/BottomToTop";
import Footer from "@/components/Footer";
import MainHeader from "@/components/header/MainHeader";
import React from "react";
import axios, { AxiosError } from "axios";
import { coupons_detail_api } from "@/utils/api_url";
import { getServerToken } from "@/helpers/server/server_function";

import CouponDetailsClient from "./CouponDetailsClient";
import { Metadata } from 'next';
import Script from 'next/script';
import { notFound } from "next/navigation";


const GetData = async (token: string, slug: string) => {
  // console.log("slug", slug);
  try {
    const { data } = await axios.post(
      coupons_detail_api,
      {
        status: "ACTIVE",
        coupon_id: slug,
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
      console.error("Error get coupon detail", error.response?.data.message);
      // toast.error(error.response?.data.message);
    } else {
      console.error("Unknown error", error);
    }
  }
};

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const token = await getServerToken();
  const { id } = await params;
  const couponData = await GetData(token, id);
  

 if (
  !couponData ||
  typeof couponData !== 'object' ||
  Array.isArray(couponData)
) {
  return {
    title: 'Coupon Not Found | BachatJar',
    description: 'The requested coupon could not be found.',
  };
}
  const title = couponData?.title;
  const description = couponData.description?.replace(/<[^>]*>?/gm, '').slice(0, 155) || '';
  const store = couponData?.store_details;

  return {
    title: `${title} - ${store?.name} Coupon | BachatJar`,
    description: `${description} Get exclusive cashback and savings with BachatJar.`,
    keywords: `${store?.name} coupons, ${store?.name} offers, ${store?.name} deals, cashback offers, BachatJar`,
    openGraph: {
      title: `${title} - Exclusive ${store?.name} Coupon`,
      description: description,
      url: `https://bachatjar.com/coupons/${id}`,
      siteName: 'BachatJar',
      images: [
        {
          url: store?.store_img || 'https://bachatjar.com/og-image.png',
          width: 800,
          height: 600,
          alt: `${store?.name} Coupon`,
        }
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} - ${store?.name} Coupon`,
      description: description,
      images: [store?.store_img || 'https://bachatjar.com/twitter-image.png'],
    },
    robots: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
    alternates: {
      canonical: `https://bachatjar.com/coupons/${id}`,
    },
  };
}

const CouponDetail = async ({ params }: any) => {
  const token = await getServerToken();
  const {id} = await params;
  const page_data = await GetData(token, id);

   if(!page_data){
      notFound()
    }
  

  // Create coupon schema
  const couponSchema = {
    "@context": "https://schema.org",
    "@type": "Offer",
    "name": page_data.title,
    "description": page_data.description?.replace(/<[^>]*>?/gm, ''),
    "price": "0",
    "priceCurrency": "INR",
    "availability": "https://schema.org/InStock",
    "seller": {
      "@type": "Organization",
      "name": page_data.store_details?.name,
      "image": page_data.store_details?.store_img
    },
    "validFrom": page_data.start_date,
    "validThrough": page_data.end_date,
    "discount": {
      "@type": "MonetaryAmount",
      "currency": "INR",
      "value": page_data.discount_value || "0"
    }
  };

  return (
    <>
      <Script
        id="coupon-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(couponSchema) }}
      />
      <MainHeader />
      <main className="">
        <section className="max-w-6xl min-h-[70vh] px-2 mx-auto mt-4 lg:mt-14 mb-16">
           <CouponDetailsClient page_data={page_data}/>
          <div className="max-w-[700px] mt-6 m-auto shadow-sm rounded rounded-tr-3xl rounded-bl-3xl relative  border-[1px] border-gray-200 py-8 px-7  bg-[#fff]">
            <h3 className="text-lg text-secondary font-semibold tracking-wide mb-3">More Detail</h3>
           <div className="dangerouslyHTML" dangerouslySetInnerHTML={{ __html: page_data.description || ''}}>

           </div>
          </div>
        </section>
        <BottomToTop />
      </main>
      <Footer />
    </>
  );
};

export default CouponDetail;
