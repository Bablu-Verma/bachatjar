/* eslint-disable @typescript-eslint/no-explicit-any */
import BottomToTop from "@/components/BottomToTop";
import Footer from "@/components/Footer";
import MainHeader from "@/components/header/MainHeader";
import React from "react";
import axios, { AxiosError } from "axios";
import { referral_product_details_client_api } from "@/utils/api_url";
import { Metadata } from 'next';
import Script from 'next/script';
import { notFound } from "next/navigation";

import Image from "next/image";

const GetData = async (slug: string) => {
  try {
    const { data } = await axios.post(
      referral_product_details_client_api,
      {
        slug: slug,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return data.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Error fetching referral detail", error.response?.data.message);
    } else {
      console.error("Unknown error", error);
    }
  }
};

export async function generateMetadata({ params }: any): Promise<Metadata> {

  const { id } = await params;
  const referralData = await GetData(id);

  if (!referralData || typeof referralData !== 'object' || Array.isArray(referralData)) {
    return {
      title: 'Referral Not Found | BachatJar',
      description: 'The requested referral campaign could not be found.',
    };
  }

  const title = referralData?.title;
  const description = referralData.description?.replace(/<[^>]*>?/gm, '').slice(0, 155) || '';


  return {
    title: `${title} -  Referral | BachatJar`,
    description: `${description} Get exclusive rewards and cashback with BachatJar.`,
    keywords: `${referralData.slug} referral,  offer, referral program, cashback offers, BachatJar`,
    openGraph: {
      title: `${title} - ${referralData.slug} Referral`,
      description: description,
      url: `https://bachatjar.com/referral-link/${referralData.slug}`,
      siteName: 'BachatJar',
      images: [
        {
          url: 'https://bachatjar.com/og-image.png',
          width: 800,
          height: 600,
          alt: `${title} Referral`,
        }
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} - Referral`,
      description: description,
      images: ['https://bachatjar.com/twitter-image.png'],
    },
    robots: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
    alternates: {
      canonical: `https://bachatjar.com/referrals/${referralData.slug}`,
    },
  };
}

const ReferralDetail = async ({ params }: any) => {

  const { id } = await params;
  const page_data = await GetData(id);

  if (!page_data) {
    notFound();
  }

  const referralSchema = {
    "@context": "https://schema.org",
    "@type": "Offer",
    "name": page_data.title,
    "description": page_data.description?.replace(/<[^>]*>?/gm, ''),
    "price": "0",
    "priceCurrency": "INR",
    "availability": "https://schema.org/InStock",
    "seller": {
      "@type": "Organization",

    },
    "validFrom": page_data.start_date,
    "validThrough": page_data.end_date,
    "url": page_data.referralLink,
  };

  return (
    <>
      <Script
        id="referral-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(referralSchema) }}
      />
      <MainHeader />
      <main className="max-w-6xl min-h-[70vh] mx-auto py-12">
        <div className="shadow-sm rounded rounded-tr-3xl rounded-bl-3xl    border-[1px] border-gray-200 py-8 px-7  bg-[#fff]">
          <div className="flex flex-col md:flex-row justify-center  md:justify-start items-start gap-4 md:gap-12">
            <div className="">
              <Image
                src={page_data.imageUrl || ''}
                alt={page_data.title}
                width={170}
                height={80}
                className="rounded-md ml-1 mb-3 w-48 lg:w-60"
              />
            </div>
           <div>
           
            <h4 className="text-lg font-medium text-secondary  pt-1 ">
              {page_data.title}
            </h4>
              <h2 className="text-2xl text-green-600 pt-1 mt-2md:pt-3 font-semibold tracking-wide mb-3">
              ₹{page_data.rewardForUser}/- 
            </h2>
            <a href={`${page_data.referralLink}`} target="_blank" className="select-none inline-block mt-6 rounded-full bg-gradient-to-r from-red-500 via-pink-500 tracking-wider to-red-600 text-white text-center font-semibold py-2 px-6 text-[12px] sm:text-sm shadow-md hover:scale-105 hover:shadow-lg transition-all duration-300 ease-in-out">Go to Referral
            </a>
           </div>
          </div>


          <div className=" mt-6  ">
            <h3 className="text-lg text-secondary font-semibold tracking-wide mb-3">Important Details</h3>
            <div
              className="dangerouslyHTML"
              dangerouslySetInnerHTML={{ __html: page_data.description || '' }}
            />
          </div>
        </div>

        <BottomToTop />
      </main>
      <Footer />
    </>
  );
};

export default ReferralDetail;
