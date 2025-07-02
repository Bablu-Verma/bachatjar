import React from "react";
import BlogCard from "../small_card/BlogCard";
import { IBlog } from "@/model/BlogModal";

const HomeBlog: React.FC<{ blogs: IBlog[] }> = ({ blogs }) => {
  return (
    <div className="max-w-6xl   mx-auto mb-20 pt-2 relative">
      <div className="max-w-6xl mx-auto px-2 pt-2 grid grid-cols-2 gap-2  sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 mb-4 sm:gap-3 md:gap-6">
        {blogs.map((item, i) => (
          <BlogCard item={item} key={i} />
        ))}
      </div>
    </div>
  );
};

export default HomeBlog;
