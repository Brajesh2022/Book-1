import React, { useState, useCallback } from 'react';
import { QueryClient, QueryClientProvider, useQuery, useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { BookOpen, AlertCircle } from 'lucide-react';

import { SearchBar } from './components/SearchBar';
import { BookCard } from './components/BookCard';
import { LoadingGrid } from './components/LoadingGrid';
import { Pagination } from './components/Pagination';
import { SummaryModal } from './components/SummaryModal';
import { apiService } from './services/api';
import { Book, SearchResponse } from './types';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

const BookSearchApp: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [summaryModal, setSummaryModal] = useState<{
    isOpen: boolean;
    title: string;
    author: string;
    summary: string;
  }>({
    isOpen: false,
    title: '',
    author: '',
    summary: ''
  });

  // Search query
  const {
    data: searchData,
    isLoading: isSearchLoading,
    error: searchError,
    refetch: refetchSearch
  } = useQuery<SearchResponse>({
    queryKey: ['search', searchQuery, currentPage],
    queryFn: () => apiService.searchBooks(searchQuery, currentPage),
    enabled: !!searchQuery,
  });

  // Summary mutation
  const summaryMutation = useMutation({
    mutationFn: ({ title, author }: { title: string; author: string }) =>
      apiService.getSummary(title, author),
    onSuccess: (data) => {
      setSummaryModal(prev => ({
        ...prev,
        summary: data.summary
      }));
    },
    onError: (error) => {
      setSummaryModal(prev => ({
        ...prev,
        summary: `Failed to generate summary: ${error.message}`
      }));
    }
  });

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSummarize = useCallback((title: string, author: string) => {
    setSummaryModal({
      isOpen: true,
      title,
      author,
      summary: ''
    });
    summaryMutation.mutate({ title, author });
  }, [summaryMutation]);

  const handleCloseSummaryModal = useCallback(() => {
    setSummaryModal(prev => ({ ...prev, isOpen: false }));
  }, []);

  const books = searchData?.books || [];
  const pagination = searchData?.pagination;

  return (
    <div className="min-h-screen bg-kindle-cream">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-kindle border-b border-gray-200"
      >
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center mb-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center"
            >
              <BookOpen className="w-8 h-8 text-kindle-blue mr-3" />
              <h1 className="text-3xl md:text-4xl font-bold text-kindle-charcoal">
                Book Archive
              </h1>
            </motion.div>
          </div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center text-gray-600 mb-8 text-lg"
          >
            Discover and download books with AI-powered summaries
          </motion.p>
          
          <SearchBar
            onSearch={handleSearch}
            isLoading={isSearchLoading}
            placeholder="Search by title, author, ISBN..."
          />
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Search Results */}
        {searchQuery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <h2 className="text-xl font-semibold text-kindle-charcoal mb-2">
              Search Results for "{searchQuery}"
            </h2>
            {searchData && (
              <p className="text-gray-600">
                Found {books.length} books {pagination && `(Page ${pagination.currentPage} of ${pagination.totalPages})`}
              </p>
            )}
          </motion.div>
        )}

        {/* Error State */}
        {searchError && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 border border-red-200 rounded-kindle p-6 mb-8"
          >
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
              <div>
                <h3 className="font-semibold text-red-800">Search Error</h3>
                <p className="text-red-700">
                  {searchError.message || 'Failed to search books. Please try again.'}
                </p>
                <button
                  onClick={() => refetchSearch()}
                  className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                >
                  Try again
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Loading State */}
        {isSearchLoading && <LoadingGrid count={12} />}

        {/* Books Grid */}
        {!isSearchLoading && books.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="books-grid"
          >
            {books.map((book: Book, index: number) => (
              <BookCard
                key={book.id}
                book={book}
                onSummarize={handleSummarize}
                index={index}
              />
            ))}
          </motion.div>
        )}

        {/* No Results */}
        {!isSearchLoading && searchQuery && books.length === 0 && !searchError && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No books found</h3>
            <p className="text-gray-500">
              Try searching with different keywords or check your spelling.
            </p>
          </motion.div>
        )}

        {/* Welcome State */}
        {!searchQuery && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center py-16"
          >
            <BookOpen className="w-24 h-24 text-kindle-blue mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-kindle-charcoal mb-4">
              Welcome to Book Archive
            </h2>
            <p className="text-gray-600 text-lg max-w-md mx-auto leading-relaxed">
              Start by searching for your favorite books. Get AI-powered summaries and instant downloads.
            </p>
          </motion.div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <Pagination
            pagination={pagination}
            onPageChange={handlePageChange}
            isLoading={isSearchLoading}
          />
        )}
      </main>

      {/* Summary Modal */}
      <SummaryModal
        isOpen={summaryModal.isOpen}
        onClose={handleCloseSummaryModal}
        title={summaryModal.title}
        author={summaryModal.author}
        summary={summaryModal.summary}
        isLoading={summaryMutation.isPending}
      />

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-white border-t border-gray-200 mt-16"
      >
        <div className="container mx-auto px-4 py-8 text-center text-gray-600">
          <p>Built with React, Express.js, and modern web technologies</p>
          <p className="mt-2 text-sm">
            Powered by AI summaries and optimized for performance
          </p>
        </div>
      </motion.footer>
    </div>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BookSearchApp />
    </QueryClientProvider>
  );
}

export default App;
