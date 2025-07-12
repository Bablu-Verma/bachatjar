/* eslint-disable @typescript-eslint/no-explicit-any */
import BottomToTop from "@/components/BottomToTop";
import Footer from "@/components/Footer";
import MainHeader from "@/components/header/MainHeader";
// import { getServerToken } from "@/helpers/server/server_function";
import { referral_product_list_client_api } from "@/utils/api_url";
import { FaLink } from "react-icons/fa";
import axios, { AxiosError } from "axios";

import Referral_Client from "./Referral_Client";
import { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Best Referral Links | BachatJar",
  description:
    "Find the latest referral links, promo deals and rewards from top brands. Save money on your online shopping with exclusive referrals from BachatJar.",
  keywords:
    "referral links, promo codes, deals, discount links, online rewards, BachatJar referral",
  openGraph: {
    title: "Latest Referral Links & Rewards - BachatJar",
    description:
      "Discover exclusive referral rewards and promo deals from top brands. Save big on your online shopping with BachatJar.",
    url: "https://bachatjar.com/referral-link",
    siteName: "BachatJar",
    images: [
      {
        url: "https://bachatjar.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "BachatJar Referral Rewards and Promo Deals",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Referral Links & Rewards",
    description:
      "Find the latest referral link and rewards from top brands at BachatJar.",
    images: ["https://bachatjar.com/twitter-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large",
    "max-video-preview": -1,
  },
  alternates: {
    canonical: "https://bachatjar.com/referral-link",
  },
};

const GetData = async () => {
  try {
    const { data } = await axios.post(
      referral_product_list_client_api,
      {},
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return data.data ?? []; // Always return array, even if empty
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Error fetching referral links", error.response?.data.message);
    } else {
      console.error("Unknown error", error);
    }
    return []; 
  }
};


export default async function ReferralPage() {
  // const token = await getServerToken();
  const referralLinks = await GetData();

  // console.log(referralLinks)

  // Schema.org structured data for referral links
 const referralListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "itemListElement": referralLinks?.map((ref: any, index: number) => ({
    "@type": "Offer",
    "position": index + 1,
    "name": ref.title,
    "description": ref.description?.replace(/<[^>]*>?/gm, ""),
    "url": `https://bachatjar.com/referral-link/${ref.slug}`,
    "validFrom": ref.start_date,
    "validThrough": ref.end_date,
    "availability": "https://schema.org/InStock",
  })) ?? [], // fallback empty array to avoid prerender error
};

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://bachatjar.com",
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Referral Links",
        "item": "https://bachatjar.com/referral-link",
      },
    ],
  };

  return (
    <>
      <Script
        id="referral-link-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(referralListSchema) }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <MainHeader />
      <main>
        <div className="max-w-6xl px-2 m-auto mt-4 lg:mt-8 mb-16">
          <div className="flex justify-center items-center h-[130px] sm:h-[200px]">
            <h1 className="text-3xl md:text-5xl uppercase text-secondary flex gap-3 font-medium">
              Referral <span className="text-primary"> Link </span>
              <FaLink className="text-primary" />
            </h1>
          </div>
          <Referral_Client referrals={referralLinks} />
        </div>
        <BottomToTop />
      </main>
      <Footer />
    </>
  );
}
