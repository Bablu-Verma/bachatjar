"use client"

import { ICategory } from "@/model/CategoryModel";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import RandomColor from "./RandomColor";

interface CategoryCard {
  item: ICategory;
}

const CategorieCard: React.FC<CategoryCard> = ({ item }) => {

  return (
    <Link href={`category/${item.slug}`} className="hover:shadow rounded-3xl relative bg-white duration-200  p-4">
      <RandomColor />
      <div className="w-full flex flex-col mt-4 justify-between items-center">
        <Image src={item.imges[0]} alt={item.name} width={70} height={70} className="mb-4 h-[60px] rounded" />
         <p className="text-gray-700 text-[12px] sm:text-sm text-center font-medium capitalize ">
          {item.name}
        </p>
      </div>
    </Link>
  );
};

export default CategorieCard;
