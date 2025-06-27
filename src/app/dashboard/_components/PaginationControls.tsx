import React from "react";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const delta = 2; 

    const range = [];
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      pages.push(1, "...", ...range);
    } else {
      pages.push(...Array.from({ length: Math.min(1 + delta * 2, totalPages - 1) }, (_, i) => i + 1));
    }

    if (currentPage + delta < totalPages - 1) {
      pages.push("...", totalPages);
    } else if (totalPages > 1) {
      pages.push(totalPages);
    }

    // Ensure the first page is always included
    if (!pages.includes(1)) {
      pages.unshift(1);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center space-x-2">
      <button
        className="px-2 py-1 text-gray-500 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <i className="fa-solid fa-angles-left text-secondary_color text-base"></i>
      </button>

      {pageNumbers.map((page, index) =>
        typeof page === "string" ? (
          <span key={index} className="px-2 py-1 text-gray-500 text-sm">
            ...
          </span>
        ) : (
          <button
            key={page}
            className={`px-2 py-1 text-sm rounded-md ${
              page === currentPage
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "text-gray-500 bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        )
      )}

      <button
        className="px-2 py-1 text-gray-500 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <i className="fa-solid fa-angles-right text-secondary_color text-base"></i>
      </button>
    </div>
  );
};

export default PaginationControls;
