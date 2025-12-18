import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (page <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", page - 1, page, page + 1, "...", totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex justify-center mt-6 gap-2 items-center">
      <button
        className={`w-7 h-7 rounded-full bg-primary-50 border flex items-center justify-center text-primary-600 text-xs hover:bg-primary-100 transition ${page === 1 ? 'cursor-default opacity-50' : 'cursor-pointer'}`}
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        title="Trang trước"
      >
        <FiChevronLeft size={16} />
      </button>
      {getPages().map((p, idx) =>
        typeof p === "number" ? (
          <button
            key={p}
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition ${page === p
                ? 'bg-primary-600 text-white shadow'
                : 'bg-primary-50 border text-primary-700 hover:bg-primary-100 cursor-pointer'
              }`}
            onClick={() => onPageChange(p)}
            disabled={page === p}
          >
            {p}
          </button>
        ) : (
          <span key={`ellipsis-${idx}`} className="w-7 h-7 flex items-center justify-center text-xs text-gray-400">...</span>
        )
      )}
      <button
        className={`w-7 h-7 rounded-full bg-primary-50 border flex items-center justify-center text-primary-600 text-xs hover:bg-primary-100 transition ${page === totalPages ? 'cursor-default opacity-50' : 'cursor-pointer'}`}
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        title="Trang sau"
      >
        <FiChevronRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;