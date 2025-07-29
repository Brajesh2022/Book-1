import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Pagination as PaginationType } from '../types';

interface PaginationProps {
  pagination: PaginationType;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
  pagination,
  onPageChange,
  isLoading = false
}) => {
  const { currentPage, totalPages, hasNext, hasPrev } = pagination;

  if (totalPages <= 1) return null;

  const generatePageNumbers = () => {
    const pages: (number | string)[] = [];
    const showPages = 7; // Number of page buttons to show
    
    if (totalPages <= showPages) {
      // Show all pages if total is less than showPages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (currentPage > 4) {
        pages.push('...');
      }
      
      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - 3) {
        pages.push('...');
      }
      
      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <motion.nav
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-center space-x-1 mt-8"
      aria-label="Pagination Navigation"
    >
      {/* Previous Button */}
      <motion.button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrev || isLoading}
        className={`p-2 rounded-kindle transition-all duration-200 ${
          hasPrev && !isLoading
            ? 'text-kindle-blue hover:bg-kindle-blue hover:text-white focus-visible-ring'
            : 'text-gray-400 cursor-not-allowed'
        }`}
        whileHover={hasPrev && !isLoading ? { scale: 1.05 } : {}}
        whileTap={hasPrev && !isLoading ? { scale: 0.95 } : {}}
      >
        <ChevronLeft className="w-5 h-5" />
        <span className="sr-only">Previous page</span>
      </motion.button>

      {/* Page Numbers */}
      <div className="flex items-center space-x-1">
        {pageNumbers.map((page, index) => (
          <React.Fragment key={`page-${page}-${index}`}>
            {page === '...' ? (
              <span className="px-3 py-2 text-gray-400">...</span>
            ) : (
              <motion.button
                onClick={() => onPageChange(page as number)}
                disabled={page === currentPage || isLoading}
                className={`px-3 py-2 rounded-kindle text-sm font-medium transition-all duration-200 ${
                  page === currentPage
                    ? 'bg-kindle-blue text-white shadow-kindle'
                    : 'text-kindle-charcoal hover:bg-gray-100 focus-visible-ring'
                } ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
                whileHover={page !== currentPage && !isLoading ? { scale: 1.05 } : {}}
                whileTap={page !== currentPage && !isLoading ? { scale: 0.95 } : {}}
              >
                {page}
              </motion.button>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Next Button */}
      <motion.button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNext || isLoading}
        className={`p-2 rounded-kindle transition-all duration-200 ${
          hasNext && !isLoading
            ? 'text-kindle-blue hover:bg-kindle-blue hover:text-white focus-visible-ring'
            : 'text-gray-400 cursor-not-allowed'
        }`}
        whileHover={hasNext && !isLoading ? { scale: 1.05 } : {}}
        whileTap={hasNext && !isLoading ? { scale: 0.95 } : {}}
      >
        <ChevronRight className="w-5 h-5" />
        <span className="sr-only">Next page</span>
      </motion.button>
    </motion.nav>
  );
};