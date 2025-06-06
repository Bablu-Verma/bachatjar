import BottomToTop from "@/components/BottomToTop";
import Footer from "@/components/Footer";
import MainHeader from "@/components/header/MainHeader";
import { MainHeading } from "@/components/Heading";
import Featured from "@/components/heropage/Featured";
import Hero from "@/components/heropage/Hero";
import BestSalling from "@/components/homepage/BestSelling";
import CallApiInHome from "@/components/homepage/CallApiInHome";
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

export const metadata: Metadata = {
  title: 'BachatJar - Save Money With Cashback & Coupons',
  description: 'Discover the best cashback offers, coupons, and deals. Save money on your online shopping with BachatJar - Your trusted cashback and coupons platform.',
  keywords: 'cashback, coupons, deals, online shopping, discounts, savings, BachatJar',
  openGraph: {
    title: 'BachatJar - Save Money With Cashback & Coupons',
    description: 'Get cashback, exclusive coupons, and best deals for your online shopping with BachatJar.',
    url: 'https://bachatjar.com',
    siteName: 'BachatJar',
    images: [
      {
        url: '/og-image.jpg',
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
    title: 'BachatJar - Save Money With Cashback & Coupons',
    description: 'Get cashback, exclusive coupons, and best deals for your online shopping with BachatJar.',
    images: ['/twitter-image.jpg'], 
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
    const data = await axios.post(home_api, {
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
  "description": "BachatJar helps you save money with cashback offers, coupons, and exclusive deals on online shopping.",
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
    "itemListElement": page_data?.data.best_product.slice(0, 10).map((product: any) => ({
      "@type": "Offer",
      "name": product.title,
      "description": product.description,
      "price": product.sale_price || product.price,
      "priceCurrency": "INR",
      "availability": "https://schema.org/InStock",
      "url": `https://bachatjar.com/product/${product.slug}`
    }))
  };

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
      
      <MainHeader />
      <CallApiInHome />

      <Hero
        home_store={page_data?.data.store}
        banner={page_data?.data.main_banner}
      />

      <main>
        <Loginhomepopup />

        {page_data?.data.flash_sale &&
          page_data?.data.flash_sale.length > 0 && (
            <div className="py-7">
              <MainHeading title="Limited Time Offer" link={null} />
              <HomeFlash flashSale={page_data?.data.flash_sale} />
            </div>
          )}

        {page_data?.data.best_product.length > 0 && (
          <div className="py-7">
            <MainHeading title="Best For You" link={null} />
            <BestSalling best_product={page_data?.data.best_product} />
          </div>
        )}

        {!token && <HowToWork />}

        <div>
          <Deals best_product={page_data?.data} />
        </div>

        {page_data?.data.long_poster.length > 0 && (
          <div className="max-w-6xl mx-auto mt-14">
            <HomePoster poster={page_data?.data.long_poster} />
          </div>
        )}

        <div className="max-w-6xl m-auto bg-gradient-to-b from-[#f1f5f8] to-[#dfe8ef] py-3 px-2 rounded-xl mt-4 lg:mt-14">
          <MainHeading title="Cashback store" link="/store" />
          <div className="max-w-6xl relative  m-auto  mb-12">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4 lg:gap-5 mt-3 lg:mt-5">
              {page_data?.data.store.map((item: IStore, i: number) => (
                <StoreCard item={item} key={i} />
              ))}
            </div>
          </div>
        </div>

        {page_data?.data.premium_product.length > 0 && (
          <div className="py-7">
            <MainHeading title="New Arrival" link={null} />
            <Featured arrival={page_data?.data.premium_product} />
          </div>
        )}

        <div className="py-7">
          <MainHeading title="New Coupon" link="/coupons" />
          <div className="max-w-6xl relative px-2 m-auto mt-2 lg:mt-8 mb-16">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-5 mt-2 lg:mt-6">
              {page_data?.data.coupon.map((item: ICoupon, i: number) => (
                <CouponcodeCard item={item} key={i} />
              ))}
            </div>
          </div>
        </div>

        {page_data?.data.category.length > 0 && (
          <div className="max-w-6xl m-auto py-3 lg:px-2 lg:rounded-xl relative bg-[#f5c4d0]">
            <MainHeading title="Browse by category" link={null} />
            <HomeCategories category={page_data?.data.category} />
          </div>
        )}

        {page_data?.data.blog.length > 0 && (
          <div className="py-7">
            <MainHeading title="Read Our Blog" link="/blog" />
            <HomeBlog blogs={page_data?.data.blog} />
          </div>
        )}
        <BottomToTop />
      </main>

      <Footer />
    </>
  );
}
