/* eslint-disable @typescript-eslint/no-explicit-any */
import BottomToTop from "@/components/BottomToTop";
import Footer from "@/components/Footer";
import MainHeader from "@/components/header/MainHeader";
import Image from "next/image";
import React from "react";
import axios, { AxiosError } from "axios";
import { category_details_api } from "@/utils/api_url";
import { getServerToken } from "@/helpers/server/server_function";
import toast from "react-hot-toast";
import CategoryClientTab from "./category_client_tab";
import { Metadata } from 'next';
import Script from 'next/script';
import { notFound } from "next/navigation";

const GetData = async ( slug: string) => {
  try {
    const { data } = await axios.post(
      category_details_api,
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
      console.error("Error registering user", error.response?.data.message);
      // toast.error(error.response?.data.message);
    } else {
      console.error("Unknown error", error);
    }
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function generateMetadata({ params }: any): Promise<Metadata> {

  const {id} = await params
  const categoryData = await GetData( id);

  if (!categoryData) {
    return {
      title: 'Category Not Found | BachatJar',
      description: 'The requested category could not be found.',
    };
  }

  const { category_details } = categoryData;
  const description = category_details.description?.replace(/<[^>]*>?/gm, '').slice(0, 155) || '';

  return {
    title: `${category_details.name} Cashback Offers & Deals | BachatJar`,
    description: `${description} Find the best cashback offers, coupons and deals in ${category_details.name} category at BachatJar.`,
    keywords: `${category_details.name}, cashback offers, coupons, deals, online shopping, BachatJar`,
    openGraph: {
      title: `${category_details.name} - Best Cashback Offers & Deals`,
      description: description,
      url: `https://bachatjar.com/category/${id}`,
      siteName: 'BachatJar',
      images: [
        {
          url: category_details.imges[0] || '/default-category.jpg',
          width: 800,
          height: 600,
          alt: `${category_details.name} Category`,
        }
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${category_details.name} Cashback Offers & Deals`,
      description: description,
      images: [category_details.imges[0] || '/default-category.jpg'],
    },
    robots: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
    alternates: {
      canonical: `https://bachatjar.com/category/${id}`,
    },
  };
}

// Update CategoryDetail component to include schema
const CategoryDetail = async ({ params }: any) => {
  const token = await getServerToken();
  const {id} = params;
  const page_data = await GetData(id);

   if(!page_data){
      notFound()
    }
  

  const { category_details, relatedProducts, relatedCoupons, relatedStore } = page_data;

  // Create category schema
  const categorySchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": category_details.name,
    "description": category_details.description?.replace(/<[^>]*>?/gm, ''),
    "url": `https://bachatjar.com/category/${id}`,
    "image": category_details.imges[0],
    "numberOfItems": relatedProducts.length + relatedCoupons.length,
    "hasPart": [
      ...relatedProducts.map((product: any) => ({
        "@type": "Product",
        "name": product.title,
        "description": product.description,
        "image": product.images?.[0],
        "offers": {
          "@type": "Offer",
          "price": product.sale_price || product.price,
          "priceCurrency": "INR"
        }
      })),
      ...relatedStore.map((store: any) => ({
        "@type": "Organization",
        "name": store.name,
        "image": store.store_img,
        "url": `https://bachatjar.com/store/${store.slug}`
      }))
    ]
  };

  return (
    <>
      <Script
        id="category-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(categorySchema) }}
      />
      <MainHeader />
      <main className="">
        <section className="max-w-6xl  px-2 mx-auto mt-4 lg:mt-14 mb-16">
          <div className="text-sm lg:text-base">
            <span>Home</span> / <span>Category</span> /{" "}
            <span>{category_details.name}</span>
          </div>
          <div className="mt-8 text-center items-center">
            <div className="h-32 w-32 rounded-full overflow-hidden justify-center items-center flex shadow-lg m-auto mb-10]">
              <Image
                src={category_details.imges[0]}
                alt="WvzprEv"
                width={500}
                className="w-full h-auto"
                height={500}
              />
            </div>
            <h1 className="text-xl text-secondary capitalize font-medium  my-3">
              {category_details.name}
            </h1>
            <div
              className="pt-4 text-sm"
              dangerouslySetInnerHTML={{
                __html: category_details.description || "",
              }}
            ></div>
          </div>
          <CategoryClientTab
            slug={id}
            relatedProducts={relatedProducts}
            relatedStore={relatedStore}
            relatedCoupons={relatedCoupons}
          />
        </section>

        <BottomToTop />
      </main>
      <Footer />
    </>
  );
};

export default CategoryDetail;
