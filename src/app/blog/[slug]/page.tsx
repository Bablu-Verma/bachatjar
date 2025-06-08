/* eslint-disable @typescript-eslint/no-explicit-any */
import BottomToTop from "@/components/BottomToTop";
import Footer from "@/components/Footer";
import MainHeader from "@/components/header/MainHeader";
import { getServerToken } from "@/helpers/server/server_function";
import { blog_details } from "@/utils/api_url";
import axios, { AxiosError } from "axios";
import Image from "next/image";
import Link from "next/link";
import styles from "./blog_page.module.css";
import React from "react";
import TableOfContents from "./TableOfContents";
import { Metadata } from 'next';
import Script from 'next/script';

const GetData = async (token: string, slug: string) => {
  try {
    const { data } = await axios.post(
      blog_details,
      {
        slug: slug,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
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

// Add generateMetadata function for dynamic SEO
export async function generateMetadata({ params }: any): Promise<Metadata> {
  const token = await getServerToken();
  const {slug} = await params
  const pageData = await GetData(token, slug);

  if (!pageData) {
    return {
      title: 'Blog Post Not Found | BachatJar',
      description: 'The requested blog post could not be found.',
    };
  }

  const { blog } = pageData;
  const description = blog.short_desc?.replace(/<[^>]*>?/gm, '').slice(0, 155) || '';

  return {
    title: `${blog.title} | BachatJar Blog`,
    description,
    keywords: `${blog.blog_type}, shopping tips, cashback guides, BachatJar blog`,
    openGraph: {
      title: blog.title,
      description,
      url: `https://bachatjar.com/blog/${slug}`,
      siteName: 'BachatJar',
      images: [
        {
          url: blog.image[0],
          width: 1200,
          height: 630,
          alt: blog.title,
        }
      ],
      locale: 'en_US',
      type: 'article',
      publishedTime: blog.createdAt,
      modifiedTime: blog.updatedAt,
      authors: [blog.writer_id.email],
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description,
      images: [blog.image[0]],
    },
    robots: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
    alternates: {
      canonical: `https://bachatjar.com/blog/${slug}`,
    },
  };
}

const BlogDetail = async ({ params }: any) => {
  const token = await getServerToken();
  const {slug} =await params
  const page_data = await GetData(token, slug);
  const { blog, relatedblogs } = page_data;

  // Create article schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blog.title,
    "description": blog.short_desc?.replace(/<[^>]*>?/gm, ''),
    "image": blog.image[0],
    "datePublished": blog.createdAt,
    "dateModified": blog.updatedAt,
    "author": {
      "@type": "Person",
      "name": blog.writer_id.email
    },
    "publisher": {
      "@type": "Organization",
      "name": "BachatJar",
      "logo": {
        "@type": "ImageObject",
        "url": "https://bachatjar.com/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://bachatjar.com/blog/${slug}`
    },
    "articleBody": blog.desc?.replace(/<[^>]*>?/gm, '')
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
        "name": "Blog",
        "item": "https://bachatjar.com/blog"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": blog.title,
        "item": `https://bachatjar.com/blog/${slug}`
      }
    ]
  };

  const formate_date = (item: string) => {
    const create_d = new Date(item);
    return create_d.toDateString();
  };

  return (
    <>
      <Script
        id="article-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <MainHeader />
      <main className="">
        <section className="max-w-6xl mx-auto  mt-6 sm:mt-14 mb-16 p-2 xl:p-0">
          <div className="lg:grid grid-cols-7 gap-8">
            <div className="col-span-5">
              <div className="text-gray-600 text-xs sm:text-sm lg:text-base uppercase flex gap-1 sm:gap-2">
                <span>By:&nbsp;{blog.writer_id.email}</span> /{" "}
                <span>{blog.blog_type}</span> /{" "}
                <span>{formate_date(blog.updatedAt)}</span>
              </div>
              <h1 className="text-3xl font-medium mb-8 mt-2 text-secondary capitalize">
                {blog.title}
              </h1>
              <Image
                src={blog?.image[0]}
                width={500}
                height={200}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="w-full max-w-[700px] mb-2 rounded-sm shadow-sm"
                alt={blog.title}
              />
              <div className="border-[1px] border-gray-600 px-2 py-3 mb-12 lg:hidden">
                <h3 className="text-2xl text-center mb-4 font-medium text-gray-800 capitalize">
                  Table of Contents
                </h3>
                <div>
                  <TableOfContents contents={blog.desc} />
                </div>
              </div>

              <div
                className="text-base border-[1px] text-gray-700 border-gray-200 rounded-md mt-10 bg-pink-200 p-4"
                dangerouslySetInnerHTML={{ __html: blog.short_desc || "" }}
              ></div>
              <div
                className={`${styles.blog_style} mt-16`}
                dangerouslySetInnerHTML={{ __html: blog.desc || "" }}
              ></div>
            </div>
            <div className="col-span-2">
              <div className="border-[1px] border-gray-600 px-2 py-3 mb-12 max-lg:hidden">
                <h3 className="text-2xl text-center mb-4 font-medium text-gray-800 capitalize">
                  Table of Contents
                </h3>
                <div>
                  <TableOfContents contents={blog.desc} />
                </div>
              </div>
              {relatedblogs && relatedblogs.length > 0 && (
                <div className="mt-10 sm:mt-0 border-[1px] border-gray-600 px-2 py-3">
                  <h3 className="text-2xl text-center mb-4 font-medium text-gray-800 capitalize">
                    Latest Articles
                  </h3>
                  <div>
                    {
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      relatedblogs.map((item: any, i: number) => (
                        <div
                          key={i + 1}
                          className="mb-4 flex justify-start gap-1"
                        >
                          <span>{i + 1}.</span>{" "}
                          <Link
                            href={`/blog/${item.slug}`}
                            className="text-base font-normal text-gray-700  hover:text-gray-900 hover:underline line-clamp-2"
                          >
                            {item.title}
                          </Link>
                        </div>
                      ))
                    }
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
        <BottomToTop />
      </main>

      <Footer />
    </>
  );
};

export default BlogDetail;
