import { ICampaignWithStore } from "@/common_type";

import Link from "next/link";
import React from "react";

interface FeaturedProps {
  arrival: ICampaignWithStore[];
}

const Featured: React.FC<FeaturedProps> = ({ arrival }) => {

  const featured_1 = arrival[0];
  const featured_2 = arrival[1];
  const featured_3 = arrival[2];
  const featured_4 = arrival[3];
  
  return (
    <div className="max-w-6xl mx-auto px-2  pt-2 md:grid gap-2 md:gap-5 gap-y-5 grid-cols-4 ">
      <div
        style={{
          backgroundImage: `url(${featured_1?.premium_product[0]?.image})`,
        }}
        className={`row-span-2 min-h-[250px]  col-span-2  bg-cover bg-center bg-no-repeat md:rounded relative`}
      >
        <div className="absolute left-5 bottom-5 w-[80%]">
          <h3 className="font-semibold capitalize text-2xl md:text-3xl line-clamp-2 text-white tracking-wide pb-2">
            {featured_1?.store.name}
          </h3>
          <p className="text-sm md:text-base text-white line-clamp-2">
            {featured_1?.title}
          </p>
          <Link
            href={
              featured_1?.slug_type === "INTERNAL"
                ? `/campaign/${featured_1?.product_slug}`
                : featured_1?.extrnal_url ?? '#'
            }
            className="underline text-white py-1 mt-3 inline-block text-sm md:text-base  font-medium"
          >
            Shop Now
          </Link>
        </div>
      </div>
      {featured_2 && (
        <div
          style={{
            backgroundImage: `url(${featured_2?.premium_product[0]?.image})`,
          }}
          className={`bg-green-500 min-h-[250px]  relative md:rounded bg-cover bg-center bg-no-repeat col-span-2`}
        >
          <div className="absolute left-5 bottom-5 w-[80%]">
            <h3 className="font-semibold  line-clamp-2 capitalize text-2xl md:text-3xl text-white tracking-wide pb-2">
              {featured_2.store.name}
            </h3>
            <p className="text-sm md:text-base text-white line-clamp-2">
              {featured_2?.title}
            </p>
            <Link
              href={
                featured_2?.slug_type === "INTERNAL"
                  ? `/campaign/${featured_2?.product_slug}`
                  : featured_2?.extrnal_url ?? '#'
              }
              className="underline text-white py-1 mt-3 inline-block text-sm md:text-base  font-medium"
            >
              Shop Now
            </Link>
          </div>
        </div>
      )}

      {featured_3 && (
        <div
          style={{
            backgroundImage: `url(${featured_3?.premium_product[0]?.image})`,
          }}
          className="bg-green-500 min-h-[220px] md:rounded bg-cover bg-center relative bg-no-repeat"
        >
          <div className="absolute left-5 bottom-5 w-[80%]">
            <h3 className="font-semibold capitalize text-2xl line-clamp-2 md:text-3xl text-white tracking-wide pb-2">
              {featured_3?.store.name}
            </h3>
            <p className="text-sm md:text-base text-white line-clamp-2">
              {featured_3?.title}
            </p>
            <Link
              href={
                featured_3?.slug_type === "INTERNAL"
                  ? `/campaign/${featured_3?.product_slug}`
                  : featured_3?.extrnal_url ?? '#'
              }
              className="underline text-white py-1 mt-3 inline-block text-sm md:text-base  font-medium"
            >
              Shop Now
            </Link>
          </div>
        </div>
      )}

      {featured_4 && (
        <div
          style={{
            backgroundImage: `url(${featured_4?.premium_product[0]?.image})`,
          }}
          className="bg-green-500 min-h-[220px] md:rounded  relative bg-cover bg-center bg-no-repeat"
        >
          <div className="absolute left-5 bottom-5 w-[80%]">
            <h3 className="font-semibold text-2xl capitalize line-clamp-2 md:text-3xl text-white tracking-wide pb-2">
              {featured_4?.store.name}
            </h3>
            <p className="text-sm md:text-base text-white line-clamp-2">
              {featured_4?.title}
            </p>
            <Link
              href={
                featured_4?.slug_type === "INTERNAL"
                  ? `/campaign/${featured_4?.product_slug}`
                  : featured_4?.extrnal_url ?? '#'
              }
              className="underline text-white py-1 mt-3 inline-block text-sm md:text-base  font-medium"
            >
              Shop Now
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Featured;
