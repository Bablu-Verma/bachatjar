import { ICampaignWithStore } from "@/common_type";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface CardProp {
  card_data: ICampaignWithStore
}


const ProductCardThree: React.FC<CardProp> = ({ card_data }) => {
  return (
    <Link  href={
      card_data.slug_type === "INTERNAL"
        ? `/campaign/${card_data.product_slug ?? ''}`
        : card_data.extrnal_url ?? '#'
     } className="block shadow cursor-pointer overflow-hidden rounded-lg relative duration-200 mx-2 border-[1px] border-transparent hover:border-pink-300 ">
      <Image
        src={card_data.product_img}
                className="w-full h-[180px] object-cover"
        height={220}
        sizes="100vw"
        width={400}
        alt={card_data?.title}
      />
    </Link>
  );
};

export default ProductCardThree;
