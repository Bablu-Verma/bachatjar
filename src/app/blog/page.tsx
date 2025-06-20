/* eslint-disable @typescript-eslint/no-explicit-any */
export const dynamic = "force-dynamic";

import BottomToTop from "@/components/BottomToTop";
import Footer from "@/components/Footer";
import MainHeader from "@/components/header/MainHeader";
import React from "react";
import Image from "next/image";
import axios from "axios";
import { get_All_blogs } from "@/utils/api_url";
import ClientBlog from "./_clientblog";
import Link from "next/link";
import { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Blog - Shopping Tips & Cashback Guides | BachatJar",
  description:
    "Discover shopping tips, cashback guides, and money-saving advice. Stay updated with the latest deals and offers through BachatJar blog.",
  keywords:
    "shopping blog, cashback guides, money saving tips, online shopping advice, BachatJar blog",
  openGraph: {
    title: "BachatJar Blog - Shopping Tips & Cashback Guides",
    description:
      "Get expert shopping tips, cashback guides, and money-saving advice from BachatJar.",
    url: "https://bachatjar.com/blog",
    siteName: "BachatJar",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BachatJar Blog",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shopping Tips & Cashback Guides | BachatJar Blog",
    description:
      "Expert shopping tips and cashback guides to help you save more.",
    images: ["/twitter-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large",
    "max-video-preview": -1,
  },
  alternates: {
    canonical: "https://bachatjar.com/blog",
  },
};

const fetchData = async () => {
  try {
    const { data } = await axios.post(
      get_All_blogs,
      {},
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!data.success) {
      throw new Error("Failed to fetch data");
    }
    return data.data;
  } catch (error) {
    console.error(error);
    return null; // Return null on error
  }
};

const AllBlog = async () => {
  const fetchBlogData = await fetchData();

  // Provide fallback values if fetchBlogData is null or missing properties
  const blogs = fetchBlogData?.blogs || [];
  const f_blog = fetchBlogData?.f_blog || {
    title: "No Featured Blog",
    short_desc: "",
    slug: "#",
    image: ["/placeholder.jpg"],
  };
  const category = fetchBlogData?.category || [];

  // Create blog list schema
  const blogListSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "BachatJar Blog",
    description: "Shopping tips, cashback guides, and money-saving advice",
    url: "https://bachatjar.com/blog",
    publisher: {
      "@type": "Organization",
      name: "BachatJar",
      logo: {
        "@type": "ImageObject",
        url: "https://bachatjar.com/logo.png",
      },
    },
    blogPost: [
      {
        "@type": "BlogPosting",
        headline: f_blog.title,
        description: f_blog.short_desc?.replace(/<[^>]*>?/gm, ""),
        image: f_blog.image[0],
        url: `https://bachatjar.com/blog/${f_blog.slug}`,
        datePublished: f_blog.createdAt,
        dateModified: f_blog.updatedAt,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `https://bachatjar.com/blog/${f_blog.slug}`,
        },
      },
      ...blogs.map((blog: any) => ({
        "@type": "BlogPosting",
        headline: blog.title,
        description: blog.short_desc?.replace(/<[^>]*>?/gm, ""),
        image: blog.image[0],
        url: `https://bachatjar.com/blog/${blog.slug}`,
        datePublished: blog.createdAt,
        dateModified: blog.updatedAt,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `https://bachatjar.com/blog/${blog.slug}`,
        },
      })),
    ],
  };

  // Create breadcrumb schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://bachatjar.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: "https://bachatjar.com/blog",
      },
    ],
  };

  return (
    <>
      <Script
        id="blog-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogListSchema) }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <MainHeader />
      <main className="pt-3">
        <section className="max-w-6xl mx-auto mb-5 p-2 xl:p-0">
          <div className="flex flex-col-reverse lg:grid grid-cols-2 gap-4 border-b-[1px] pb-14 border-b-gray-200">
            <div className="pt-20 pr-5">
              <small className="text-primary uppercase text-base mb-3">
                FEATURED
              </small>
              <h3 className="text-3xl line font-medium mb-6 mt-2 text-secondary capitalize">
                {f_blog.title}
              </h3>
              <div
                className="text-base line-clamp-6 text-gray-700"
                dangerouslySetInnerHTML={{ __html: f_blog.short_desc || "" }}
              ></div>
              <div className="mt-14">
                <Link
                  className="text-sm bg-primary rounded-sm text-light px-5 py-2"
                  href={`/blog/${f_blog?.slug}`}
                >
                  Read More
                </Link>
              </div>
            </div>
            <Image
              height={200}
              width={500}
              className="w-[100%] h-auto"
              alt={f_blog.title}
              src={f_blog.image[0]}
            />
          </div>
        </section>
        <section className="max-w-6xl mx-auto mb-16 p-2 xl:p-0">
          <ClientBlog blog={blogs} category={category} />
        </section>
        <BottomToTop />
      </main>
      <Footer />
    </>
  );
};

export default AllBlog;
