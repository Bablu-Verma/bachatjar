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
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center space-x-2">
      <button
        className="px-2 py-1 text-gray-500 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <i className="fa-solid text-secondary_color text-base fa-angles-left"></i>
      </button>

      {pages.map((page) =>
        page === currentPage ? (
          <button
            key={page}
            className="px-2 py-1 text-white text-sm bg-blue-500 rounded-md hover:bg-blue-600"
          >
            {page}
          </button>
        ) : (
          <button
            key={page}
            className="px-2 py-1 text-gray-500 text-sm bg-gray-200 rounded-md hover:bg-gray-300"
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        )
      )}

      <button
        className="px-2 py-1 text-gray-500 bg-gray-200 rounded-md hover:bg-gray-300"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <i className="fa-solid fa-angles-right text-secondary_color text-base"></i>
      </button>
    </div>
  );
};

export default PaginationControls;
