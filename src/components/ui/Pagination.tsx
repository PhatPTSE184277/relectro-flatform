import React from "react";

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
    <div className="flex justify-center items-center gap-2 py-4">
            <button
              className="px-3 py-2 rounded-lg bg-primary-50 text-text-main hover:bg-primary-100 font-medium transition disabled:opacity-50"
              disabled={page === 1}
              onClick={() => onPageChange(page - 1)}
            >
              &lt;
            </button>
      {getPages().map((p, idx) =>
        typeof p === "number" ? (
          <button
            key={p}
            className={`px-3 py-2 rounded-lg font-medium transition ${
                    p === page
                      ? "bg-primary-600 text-white shadow"
                      : "bg-primary-50 text-text-main hover:bg-primary-100"
            }`}
            onClick={() => onPageChange(p)}
            disabled={p === page}
          >
            {p}
          </button>
        ) : (
          <span key={idx} className="px-2 py-2 text-gray-400 select-none">
            ...
          </span>
        )
      )}
            <button
              className="px-3 py-2 rounded-lg bg-primary-50 text-text-main hover:bg-primary-100 font-medium transition disabled:opacity-50"
              disabled={page === totalPages}
              onClick={() => onPageChange(page + 1)}
            >
              &gt;
            </button>
    </div>
  );
};

export default Pagination;