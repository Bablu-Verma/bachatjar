'use client'

import Link from "next/link";
import React, { useEffect, useState } from "react";

interface ITableOfContents {
  contents: string;
}

interface Heading {
  id: string;
  level: number;
  text: string;
}

const TableOfContents = ({ contents }: ITableOfContents) => {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [hHeight, setHHeight] = useState(true)

 useEffect(() => {
  const extractHeadings = (htmlString: string): Heading[] => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlString;

    const headings: Heading[] = [];
    tempDiv.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach((heading) => {
      const level = parseInt(heading.tagName[1]);
      let text = heading.textContent?.trim() || "Untitled Heading";

      // ✅ Remove leading numbering (e.g., "5.", "2.3", "3. ", "4: ", etc.)
      text = text.replace(/^\d+(\.\d+)*[\s.:-]*\s*/, "");

      const id = heading.getAttribute("id") || "";

      if (id) {
        headings.push({ id, level, text });
      }
    });

    return headings;
  };

  const extractedHeadings = extractHeadings(contents);
  setHeadings(extractedHeadings);
}, [contents]);


  return (
    <div>
      <div className={`${hHeight ? 'h-[150px]' : 'h-auto'} overflow-auto  lg:h-auto`}>
        {headings.map((item, i) => (
          <div key={item.id} className="group mb-4 flex justify-start gap-1">
            <span className="group-hover:text-blue-500 text-gray-700">
              {i + 1}.
            </span>
            <Link
              href={`#${item.id}`}
              className="text-base font-normal text-gray-700 group-hover:text-blue-500 group-hover:underline line-clamp-2"
            >
              {item.text}
            </Link>
          </div>
        ))}

      </div>
      <button
        onClick={() => setHHeight(!hHeight)}
        className="text-sm text-primary lg:hidden"
        type="button"
      >
        {hHeight ? "Show All" : "Show Less"}
      </button>
    </div>
  );
};

export default TableOfContents;
