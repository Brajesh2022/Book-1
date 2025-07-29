'use client';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pages: number[];
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, pages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <nav className="mt-12 flex justify-center" aria-label="Pagination">
      <div className="isolate inline-flex -space-x-px rounded-md shadow-sm">
        {/* Previous button */}
        <button
          onClick={() => canGoPrevious && onPageChange(currentPage - 1)}
          disabled={!canGoPrevious}
          className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-kindle-muted ring-1 ring-inset ring-kindle-border hover:bg-kindle-hover focus:z-20 focus:outline-offset-0 transition-colors duration-200 ${
            !canGoPrevious ? 'opacity-50 cursor-not-allowed' : 'hover:text-kindle-dark'
          }`}
          aria-label="Previous page"
        >
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path 
              fillRule="evenodd" 
              d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" 
              clipRule="evenodd" 
            />
          </svg>
        </button>

        {/* Page numbers */}
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold transition-all duration-200 focus:z-20 focus:outline-offset-0 ${
              page === currentPage
                ? 'z-10 bg-kindle-accent text-white focus:bg-kindle-accent/90'
                : 'text-kindle-text ring-1 ring-inset ring-kindle-border hover:bg-kindle-hover hover:text-kindle-dark'
            }`}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        ))}

        {/* Next button */}
        <button
          onClick={() => canGoNext && onPageChange(currentPage + 1)}
          disabled={!canGoNext}
          className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-kindle-muted ring-1 ring-inset ring-kindle-border hover:bg-kindle-hover focus:z-20 focus:outline-offset-0 transition-colors duration-200 ${
            !canGoNext ? 'opacity-50 cursor-not-allowed' : 'hover:text-kindle-dark'
          }`}
          aria-label="Next page"
        >
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path 
              fillRule="evenodd" 
              d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" 
              clipRule="evenodd" 
            />
          </svg>
        </button>
      </div>

      {/* Page info */}
      <div className="ml-4 flex items-center text-sm text-kindle-muted">
        Page {currentPage} of {totalPages}
      </div>
    </nav>
  );
}