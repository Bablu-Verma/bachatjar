import BottomToTop from "@/components/BottomToTop";
import Footer from "@/components/Footer";
import MainHeader from "@/components/header/MainHeader";
import { MainHeading } from "@/components/Heading";
import Featured from "@/components/homepage/Featured";
import Hero from "@/components/heropage/Hero";
import BestSalling from "@/components/homepage/BestSelling";

import Deals from "@/components/homepage/Deals";
import HomeBlog from "@/components/homepage/HomeBlog";
import HomeCategories from "@/components/homepage/HomeCategories";
import HomeFlash from "@/components/homepage/HomeFlash";
import HomePoster from "@/components/homepage/HomePoster";
import HowToWork from "@/components/HowToWork";
import Loginhomepopup from "@/components/Loginhomepopup";
import CouponcodeCard from "@/components/small_card/CouponcodeCard";
import StoreCard from "@/components/small_card/StoreCard";
import { getServerToken } from "@/helpers/server/server_function";
import { ICoupon } from "@/model/CouponModel";
import { IStore } from "@/model/StoreModel";
import { home_api } from "@/utils/api_url";
import axios, { AxiosError } from "axios";
import { Metadata } from 'next';
import Script from 'next/script';

import HomeClientDataSet from "@/components/homepage/HomeClientDataSet";
import DealOfTheDayMobile from "@/components/heropage/DealOfTheDayMobile";
import Newsletter from "@/components/newsletter";

import ReferralCard from "@/components/small_card/ReferralCard";
import { IReferral } from "@/model/ReferralModel";
import TopHeader from "@/components/header/TopHeader";
import FromStore from "@/components/homepage/FromStore";


export const metadata: Metadata = {
 title: "BachatJar – Cashback, Coupons, Referral Link & Promo Codes | Save Big on Every Online Purchase in India",
  description: 'Shop online & earn real cashback on every purchase. Get latest discount coupons, promo codes & exclusive offers only at BachatJar',
  keywords: 'Cashback website India, Best cashback offers, Online shopping cashback, Discount coupons India, Promo codes Flipkart/Amazon, savings,Earn money shopping online, BachatJar,Real cashback deals, Top cashback sites in India ',
  openGraph: {
   title: "BachatJar – Cashback, Coupons & Promo Codes | Save Big on Every Online Purchase in India",
    description: 'Shop online & earn real cashback on every purchase. Get latest discount coupons, promo codes & exclusive offers only at BachatJar',
    url: 'https://bachatjar.com',
    siteName: 'BachatJar',
    images: [
      {
        url: 'https://bachatjar.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'BachatJar - Save Money With Cashback & Coupons',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  title: "BachatJar – Cashback, Coupons & Promo Codes | Save Big on Every Online Purchase in India",
   description: 'Shop online & earn real cashback on every purchase. Get latest discount coupons, promo codes & exclusive offers only at BachatJar',
    images: ['https://bachatjar.com/twitter-image.png'], 
    creator: '@bachatjar',
    site: '@bachatjar',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'cODByDz2q86NuNp7VN0zYzoJCHxGy6MNuhft7D9Jk0w',
  },
  alternates: {
    canonical: 'https://bachatjar.com',
  },
};

const GetData = async (token: string) => {
  try {
    const data = await axios.post(home_api,
      {
       tag : 'hot',
       page: 1
      },
      {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return data.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Error home data  fatching", error.response?.data.message);
    } else {
      console.error("Unknown error", error);
    }
  }
};

const homePageSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "BachatJar",
  "url": "https://bachatjar.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://bachatjar.com/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  },
  "sameAs": [
    "https://facebook.com/bachatjar",
    "https://twitter.com/bachatjar",
    "https://instagram.com/bachatjar",
    "https://linkedin.com/company/bachatjar"
  ]
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "BachatJar",
  "url": "https://bachatjar.com",
  "logo": "https://bachatjar.com/logo.png",
   "description": 'Shop online & earn real cashback on every purchase. Get latest discount coupons, promo codes & exclusive offers only at BachatJar',
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "IN"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer support",
    "email": "support@bachatjar.com"
  }
};

export default async function Home() {
  const token = await getServerToken();
  const page_data = await GetData(token);

  if (!page_data) {
    return <div>Error fetching data</div>;
  }

  // Create dynamic offers schema based on deals
  const offersSchema = {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    "name": "BachatJar Deals and Offers",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    "itemListElement": page_data?.data.best_product?.slice(0, 10).map((product: any) => ({
      "@type": "Offer",
      "name": product.title,
      "description": product.description,
      "price": product.sale_price || product.price,
      "priceCurrency": "INR",
      "availability": "https://schema.org/InStock",
      "url": `https://bachatjar.com/product/${product.slug}`
    }))
  };



  // console.log(page_data?.data.from_amazon)

  return (
    <>
      <Script
        id="schema-website"
        type="application/ld+json"
       
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homePageSchema) }}
      />
      <Script
        id="schema-organization"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <Script
        id="schema-offers"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(offersSchema) }}
      />
      <TopHeader />
      <MainHeader />
      <HomeClientDataSet notification={page_data?.data.notification} watchlist={page_data?.data?.watchlist} />
      <Loginhomepopup />


      <Hero
        deals={page_data?.data.live_product}
        banner={page_data?.data.main_banner}
      />

      <main>

       {page_data?.data.live_product &&
          page_data?.data.live_product?.length > 0 && (
            <div className="pt-8 lg:pt-10 md:hidden">
              <MainHeading title="Live Deals" link={null} />
              <DealOfTheDayMobile deals={page_data?.data.live_product} />
            </div>
          )}
       
        {page_data?.data.flash_sale &&
          page_data?.data.flash_sale?.length > 0 && (
            <div className="pt-8 lg:pt-10">
              <MainHeading title="Limited Time Offer" link={null} />
              <HomeFlash flashSale={page_data?.data.flash_sale} />
            </div>
          )}

            
         <HowToWork />
          

        {page_data?.data.best_product?.length > 0 && (
          <div className="pt-8 lg:pt-10">
            <MainHeading title="Best For You" link={null} />
            <BestSalling best_product={page_data?.data.best_product} />
          </div>
        )}

       

       <Deals  />

        {page_data?.data.long_poster?.length > 0 && (
          <div className="max-w-6xl mx-auto pt-8 lg:pt-10">
            <HomePoster poster={page_data?.data.long_poster} />
          </div>
        )}

        <div className="max-w-6xl m-auto bg-gradient-to-b from-[#f1f5f8] to-[#dfe8ef] py-3 px-2 rounded-xl pt-8 lg:pt-10">
          <MainHeading title="Cashback store" link="/store" />
          <div className="max-w-6xl relative m-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4 lg:gap-5 pt-2">
              {page_data?.data.store?.map((item: IStore, i: number) => (
                <StoreCard item={item} key={i} />
              ))}
            </div>
        </div>

        {page_data?.data.premium_product?.length > 0 && (
          <div className="pt-8 lg:pt-10">
            <MainHeading title="New Arrival" link={null} />
            <Featured arrival={page_data?.data.premium_product} />
          </div>
        )}


        

        <div className="pt-8 lg:pt-10">
          <MainHeading title="New Coupon" link="/coupons" />
          <div className="max-w-6xl relative px-2 m-auto mt-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-5 ">
              {page_data?.data.coupon?.slice(0,6).map((item: ICoupon, i: number) => (
                <CouponcodeCard item={item} key={i} />
              ))}
            </div>
        </div>

        

        {page_data?.data.category?.length > 0 && (
          <div className="max-w-6xl m-auto py-3 mt-8 lg:mt-10 lg:px-2 lg:rounded-xl relative bg-[#f5c4d0]">
            <MainHeading title="Browse by category" link={null} />
            <HomeCategories category={page_data?.data.category} />
          </div>
        )}


        {page_data?.data.from_amazon &&
          page_data?.data.from_amazon?.length > 0 && (
            <div className=" max-w-6xl m-auto rounded-xl  pt-8 lg:pt-10">
              <MainHeading title="Amazon Best" link={`${process.env.NEXT_PUBLIC_SITE_URL}/store/amazon`} />
              <FromStore deals={page_data?.data.from_amazon} />
            </div>
          )}

         <div className="max-w-6xl m-auto rounded-xl pt-8 lg:pt-10">
          <MainHeading title="Referral Links" link="/referral-link" />
          <div className="max-w-6xl px-2 relative m-auto grid grid-cols-2 pb-5 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-5 pt-2">
              {page_data?.data.referrals?.slice(0.6).map((item: IReferral, i: number) => (
               <ReferralCard key={i} item={item} />
              ))}
            </div>
        </div>

        {page_data?.data.blog?.length > 0 && (
          <div className="max-w-6xl m-auto mt-8 mb-24 lg:mt-10">
            <MainHeading title="Read Our Blog" link="/blog" />
            <HomeBlog blogs={page_data?.data.blog} />
          </div>
        )}
        <BottomToTop />
      </main>
      <Newsletter />
      <Footer />
     
    </>
  );
}
