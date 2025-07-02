"use client";

import { IBlog } from "@/model/BlogModal";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface BlogCardProps {
  item: IBlog;
}

const BlogCard: React.FC<BlogCardProps> = ({ item }) => {
  const date = new Date(item.createdAt ?? Date.now());
  const option = { day: "2-digit", month: "short", year: "numeric" };
  const formattedDate = date.toLocaleDateString(
    "en-GB",
    option as Intl.DateTimeFormatOptions
  );

  // for new badge
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);
  // console.log("date", diffTime);

  return (
    <div className="shadow rounded-md overflow-hidden relative hover:shadow-lg duration-200 group bg-[#fff]">
      {diffTime < 12 && (
        <span className="absolute top-2 left-2 bg-green-600 py-[2px] px-2 text-[12px] rounded-md shadow-md text-white font-medium z-20 select-none">
          New
        </span>
      )}
      <div className="max-h-[200px] overflow-hidden relative">
        <span className="w-full h-auto bg-[rgba(0,0,0,.2)] absolute top-0 left-0 bottom-0 right-0 z-10"></span>
        <Image
     
          src={item?.image[0]}
          className="w-full h-[130px]"
          alt="shose"
          fill={false}
          width={400}
          height={200}
          style={{ objectFit: "cover" }}
          priority={diffTime < 12}
        />
      </div>
      <div className="pb-2 pt-1 px-2">
        <h4 className="text-gray-800 font-medium text-sm py-1 line-clamp-2">
          {item?.title}
        </h4>
        <div className="">
          <div className="flex justify-between mt-1 items-center">
            <span  className="text-gray-500 mr-2 md:mr-3 text-[12px] text-sm">
              <i className="fa-regular fa-eye"></i> {item?.views}
            </span>
            <span  className="text-gray-500 text-[12px] md:text-sm">
              <i className="fa-regular fa-clock"></i> {formattedDate}
            </span>
          </div>
          <Link
            href={`/blog/${item?.slug}`}
            className="text-primary mt-1 text-sm md:text-base text-nowrap hover:pr-1 duration-200"
          >
            Read More
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
