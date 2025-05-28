import Link from "next/link";
import React from "react";

interface HeadingProps {
  title: string;
  link: string | null
}


export const MainHeading: React.FC<HeadingProps> = ({ title, link = null }) => {
  return (
    <div className="max-w-6xl mx-auto px-2 flex justify-between items-center py-2 lg:py-4">
      <div className="flex items-center  justify-start">
        <span className="bg-primary w-5 h-8 inline-block px-2 lg:px-2.5 rounded"></span>
        <h3 className="text-primary font-semibold text-lg md:text-xl capitalize ml-2 lg:ml-4">
          {title}
        </h3>
      </div>
      {
        link &&  <Link
        href={link}
        className="text-primary  py-2 px-5 sm:px-8 rounded-sm capitalize font-medium text-sm hover:shadow-sm duration-200"
      >
        View All
      </Link>
      }
     
    </div>
  );
};
