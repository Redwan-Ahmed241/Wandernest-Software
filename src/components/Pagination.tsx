import React from 'react';
import { ChevronLeft, ChevronRight } from 'react-feather';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  totalItems: number;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems,
  className = '',
}) => {
  // Don't render pagination if there's only one page or no items
  if (totalPages <= 1) return null;

  // Calculate items range for current page
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages with ellipsis
      if (currentPage <= 3) {
        // Near the beginning
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        // In the middle
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
      {/* Items info */}
      <div className="text-sm text-gray-600">
        Showing {startItem} to {endItem} of {totalItems} results
      </div>

      {/* Pagination controls */}
      <div className="flex items-center gap-2">
        {/* Previous button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`
            flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-200
            ${currentPage === 1 
              ? 'text-gray-400 cursor-not-allowed bg-gray-100' 
              : 'text-gray-700 hover:text-[#6ab187] hover:bg-[#6ab187]/10 bg-white border border-gray-200 hover:border-[#6ab187]'
            }
          `}
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className="px-3 py-2 text-gray-400">...</span>
              ) : (
                <button
                  onClick={() => onPageChange(page as number)}
                  className={`
                    px-3 py-2 rounded-lg font-medium transition-all duration-200 min-w-[40px]
                    ${currentPage === page
                      ? 'text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105'
                      : 'text-gray-700 hover:text-[#6ab187] hover:bg-[#6ab187]/10 bg-white border border-gray-200 hover:border-[#6ab187]'
                    }
                  `}
                  style={currentPage === page ? { backgroundColor: '#6ab187' } : {}}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Next button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`
            flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-200
            ${currentPage === totalPages 
              ? 'text-gray-400 cursor-not-allowed bg-gray-100' 
              : 'text-gray-700 hover:text-[#6ab187] hover:bg-[#6ab187]/10 bg-white border border-gray-200 hover:border-[#6ab187]'
            }
          `}
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;