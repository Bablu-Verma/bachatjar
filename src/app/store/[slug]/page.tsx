/* eslint-disable @typescript-eslint/no-explicit-any */
import BottomToTop from "@/components/BottomToTop";
import Footer from "@/components/Footer";
import MainHeader from "@/components/header/MainHeader";
import Image from "next/image";
import React from "react";
import axios, { AxiosError } from "axios";
import { store_details_api } from "@/utils/api_url";
import { getServerToken } from "@/helpers/server/server_function";

import { Store_tc, StoreDesc } from "./store_desc_tc";
import Link from "next/link";
import StoreClientTab from "./store_client_tab";
import tracking_image from "../../../../public/track.webp";
import UserStoreAction from "./user_store_action";
import Script from 'next/script';
import { Metadata } from "next";
import { notFound } from 'next/navigation'

interface topstoreProps {
  _id: string;
  name: string; 
  slug: string;
}


const GetData = async (token: string, slug: string) => {
  try {
    const { data } = await axios.post(
      store_details_api,
      { slug },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return data.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Error fetching store details", error.response?.data.message);
      // toast.error(error.response?.data.message);
      
    } else {
      console.error("Unknown error", error);
    }
    return null; 
  }
};

export const generateMetadata = async ({ params }: any): Promise<Metadata> => {
  const {slug} =  await params;
  
  // Fetch store data for dynamic metadata
  try {
    const { data } = await axios.post(
      store_details_api,
      { slug },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    
    const store = data.data.store;
    const storeName = store.name;
    const storeDescription = store.description?.replace(/<[^>]*>?/gm, '').slice(0, 155) || '';
    const storeImage = store.store_img;

    return {
      title: `${storeName} Cashback Offers & Coupons | BachatJar`,
      description: `Get up to ${store.cashback_type === "FLAT_AMOUNT" ? `₹${store.cashback_rate}` : `${store.cashback_rate}%`} cashback at ${storeName}. ${storeDescription}`,
      keywords: `${storeName} cashback, ${storeName} coupons, ${storeName} offers, ${storeName} deals, BachatJar`,
      openGraph: {
        title: `${storeName} - Exclusive Cashback Offers & Coupons`,
        description: `Save money on ${storeName} with exclusive cashback offers and coupons. Get up to ${store.cashback_type === "FLAT_AMOUNT" ? `₹${store.cashback_rate}` : `${store.cashback_rate}%`} cashback on your purchases.`,
        url: `https://bachatjar.com/store/${slug}` || 'https://bachatjar.com/og-image.png',
        siteName: 'BachatJar',
        images: [
          {
            url: storeImage,
            width: 800,
            height: 600,
            alt: `${storeName} Store Logo`,
          }
        ],
        locale: 'en_US',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${storeName} Cashback & Coupons | BachatJar`,
        description: `Save money on ${storeName} with exclusive cashback offers and coupons.`,
        images: [storeImage || 'https://bachatjar.com/twitter-image.png'],
        creator: '@bachatjar',
        site: '@bachatjar',
      },
      robots: {
        index: true,
        follow: true,
        'max-snippet': -1,
        'max-image-preview': 'large',
        'max-video-preview': -1,
      },
      alternates: {
        canonical: `https://bachatjar.com/store/${slug}`,
      },
    };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    // Fallback metadata if store data fetch fails
    return {
      title: `Store Details - ${slug} | BachatJar`,
      description: `Find the best cashback offers and coupons for ${slug} at BachatJar.`,
      openGraph: {
        title: `${slug} - Cashback Offers & Coupons`,
        description: `Find the best cashback offers and coupons for ${slug} at BachatJar.`,
        url: `https://bachatjar.com/store/${slug}`,
        siteName: 'BachatJar',
      },
    };
  }
}



const StoreDetail = async ({ params }: any) => {
  const token = await getServerToken();
  const {slug} = await params;
  const page_data = await GetData(token, slug);


  // console.log("store page data ", page_data)

  if (!page_data) {
   
     notFound()
  }

  const {
    store,
    related_product = [],
    related_coupons = [],
    related_stores = [],
    top_stores = [],
  } = page_data;

  const storeSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": store.name,
    "image": store.store_img,
    "description": store.description?.replace(/<[^>]*>?/gm, ''),
    "url": `https://bachatjar.com/store/${slug}`,
    "offers": {
      "@type": "Offer",
      "description": `Up to ${store.cashback_type === "FLAT_AMOUNT" ? `₹${store.cashback_rate}` : `${store.cashback_rate}%`} cashback`,
      "priceCurrency": "INR",
      "availability": "https://schema.org/InStock",
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.5",
      "reviewCount": "100"
    }
  };


  return (
    <>
      <MainHeader />
      <main className="">
        <section className="w-full bg-primary px-2 mx-auto ">
          <div className="max-w-6xl py-20 px-2.5 mx-auto relative">
            <div className="sm:grid  sm:grid-cols-[15%_85%] lg:grid-cols-[10%_90%] gap-5 ">
              <div className=" flex items-end pb-3 sm:pb-0 sm:inline gap-3">
                <Image
                  src={store.store_img}
                  alt="WvzprEv"
                  width={40}
                  className="w-20 sm:w-full"
                  height={40}
                />
                <div className="sm:hidden ">
                  <h1 className="  text-lg capitalize  text-white font-normal ">
                    {store.name}
                  </h1>
                  <p className="text-2xl text-center font-medium text-light pt-1 ">
                    {store.cashback_type == "FLAT_AMOUNT" && (
                      <>₹{store.cashback_rate}.00</>
                    )}
                    {store.cashback_type == "PERCENTAGE" && (
                      <>{store.cashback_rate}%</>
                    )}
                    {
                   store.store_type == 'INSENTIVE'? " Cashback":' Save'
                    }
                  </p>
                </div>
              </div>
              <div>
                <h1 className="hidden sm:block text-2xl capitalize  text-white font-medium ">
                  {store.name}
                </h1>

                <StoreDesc html_={store.description || ""} />
                <div className="sm:flex gap-5  mt-6">
                  <UserStoreAction store_={store} />
                  <p className="hidden sm:inline-block text-xl text-center font-medium text-light pt-1 ">
                    {store.cashback_type == "FLAT_AMOUNT" && (
                      <>₹{store.cashback_rate}.00</>
                    )}
                    {store.cashback_type == "PERCENTAGE" && (
                      <>{store.cashback_rate}%</>
                    )}
                   {
                   store.store_type == 'INSENTIVE'? " Cashback":' Save'
                    }
                  </p>
                </div>
              </div>
            </div>

            <Store_tc store_tc={store.tc} />
          </div>
        </section>
        {
            store.tracking && <section className="max-w-6xl mx-auto h-12 relative">
          
          <div className="p-2 px-5 flex justify-center items-center gap-5">
            <span className="text-base text-secondary">Tracking Speed: </span>
            <Image
              src={tracking_image}
              alt="WvzprEv"
              sizes="100vw"
              width={10}
              className="h-auto w-10"
              height={10}
            />

            <strong className="text-xl text-secondary tracking-wider capitalize">
              {store.tracking}
            </strong>
          </div>
        </section>
          }
        
        <section className="max-w-6xl px-2.5 my-12 mx-auto flex   flex-col-reverse sm:grid lg:gap-16 sm:gap-5 min-h-60 grid-cols-4">
          <div className="col-span-1 mt-12 sm:mt-0 ">
            {store.claim_form == "ACTIVE_CLAIM_FORM" && (
              <Link
                className="w-full rounded-full flex justify-center items-center border-[1px] border-primary py-2 text-lg  mb-10 text-primary hover:text-gray-600 hover:border-gray-600 ease-in-out duration-200"
                href={`/claim-form/${store._id}`}
              >
                <span>Claim Form</span>
              </Link>
            )}

            {top_stores && top_stores.length > 0 && (
              <div className="p-3 border-[1px] rounded shadow-sm border-gray-300 mb-10 ">
                <h3 className="text-center text-xl font-medium mb-3">
                  Top Store
                </h3>
                {top_stores.map((item: topstoreProps, i: number) => (
                  <p
                    className="text-lg capitalize text-secondary mb-2"
                    key={i}
                  >
                   
                    {i + 1}.
                    <Link className=" hover:underline" href={`/store/${item.slug}`}>
                      {item.name}
                    </Link>
                  </p>
                ))}
              </div>
            )}

            {related_stores && related_stores.length > 0 && (
              <div className="p-3 border-[1px] rounded shadow-sm border-gray-300 mb-10 ">
                <h3 className="text-center text-xl font-medium mb-3">
                  Related Store
                </h3>
                {related_stores.map((item: topstoreProps, i: number) => (
                  <p
                    className="text-lg capitalize text-secondary mb-2"
                    key={i}
                  >
                   
                    {i + 1}.{" "}
                    <Link
                      className=" hover:underline hover:text-primary"
                      href={`/store/${item.slug}`}
                    >
                      {item.name}
                    </Link>
                  </p>
                ))}
              </div>
            )}
          </div>
          <div className="col-span-3 ">
            <StoreClientTab
              slug={slug}
              relatedProducts={related_product}
              relatedCoupons={related_coupons}
            />
          </div>
        </section>
        <BottomToTop />
      </main>
      <Footer />
      <Script
        id="store-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(storeSchema) }}
      />
    </>
  );
};

export default StoreDetail;
