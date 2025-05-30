"use client";

import React, { useState } from "react";

import CategorieCard from "../small_card/CategorieCard";
import { ICategory } from "@/model/CategoryModel";
import { IoMdClose } from "react-icons/io";
import { MainHeading } from "../Heading";

interface CategoryProps {
  category: ICategory[];
}

const HomeCategories: React.FC<CategoryProps> = ({ category }) => {
  const [opendrawer, setOpendrawer] = useState(false);

  return (
    <>
      <div className="max-w-6xl mx-auto pt-2 mb-4">
        <button
          onClick={() => setOpendrawer(true)}
          className="text-primary  py-2 px-5 sm:px-8 rounded-sm capitalize font-medium text-sm hover:shadow-sm duration-200 absolute top-7 right-0 z-20"
        >
          View All
        </button>
        <div className="grid grid-cols-[repeat(auto-fit,_minmax(150px,1fr))] px-2 gap-4 sm:gap-5">
          {category.slice(0, 5).map((item, i) => (
            <CategorieCard item={item} key={i} />
          ))}
        </div>
      </div>

      {opendrawer && (
        <div
          style={{ background: "rgba(0,0,0,0.3)" }}
          className="fixed z-30 top-0 left-0 right-0 bottom-0 flex justify-center items-center "
        >
          <div className="bg-gray-300 p-4 mx-2 relative rounded-lg shadow-md min-h-[500px] max-h-[80vh] overflow-auto w-full max-w-6xl">
            <button
              title="close"
              className=" absolute top-5 right-4 bg-white p-1  rounded-full"
              onClick={() => setOpendrawer(false)}
            >
              <IoMdClose className="text-lg text-primary" />
            </button>

            <MainHeading title="Browse category" link={null} />
            <div className="pt-4 flex justify-start items-center flex-wrap gap-4">
              {category &&
                category.length > 0 &&
                category.map((item, i) => (
                  <CategorieCard item={item} key={i} />
                ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HomeCategories;
