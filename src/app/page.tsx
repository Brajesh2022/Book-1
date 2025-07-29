'use client';

import { useState, useEffect, useCallback } from 'react';
import { Book, SearchResult } from '@/types/book';
import SearchHeader from '@/components/SearchHeader';
import BookGrid from '@/components/BookGrid';
import Pagination from '@/components/Pagination';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import SummaryModal from '@/components/SummaryModal';

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [currentQuery, setCurrentQuery] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    pages: [] as number[]
  });
  const [selectedBook, setSelectedBook] = useState<{ title: string; author: string } | null>(null);

  const searchBooks = useCallback(async (query: string, page: number = 1) => {
    if (!query.trim()) {
      setError('Please enter a search term.');
      return;
    }

    setLoading(true);
    setError('');
    setBooks([]);

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, page }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch books');
      }

      const searchResult: SearchResult = result.data;
      
      if (searchResult.books.length === 0) {
        setError('No books found for your query.');
      } else {
        setBooks(searchResult.books);
        setPagination(searchResult.pagination);
        setCurrentQuery(query);
      }
    } catch (error) {
      console.error('Search error:', error);
      setError('Failed to fetch book data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handlePageChange = useCallback((page: number) => {
    if (currentQuery) {
      searchBooks(currentQuery, page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentQuery, searchBooks]);

  const handleSummarize = useCallback((title: string, author: string) => {
    setSelectedBook({ title, author });
  }, []);

  const closeSummaryModal = useCallback(() => {
    setSelectedBook(null);
  }, []);

  return (
    <div className="min-h-screen">
      <SearchHeader onSearch={searchBooks} loading={loading} />
      
      <div className="container mx-auto px-4 py-8">
        {error && <ErrorMessage message={error} />}
        
        {loading && <LoadingSpinner />}
        
        {!loading && books.length > 0 && (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-kindle-dark mb-2">
                Search Results for &ldquo;{currentQuery}&rdquo;
              </h2>
              <p className="text-kindle-muted">
                Found {books.length} books on page {pagination.currentPage} of {pagination.totalPages}
              </p>
            </div>
            
            <BookGrid books={books} onSummarize={handleSummarize} />
            
            {pagination.totalPages > 1 && (
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                pages={pagination.pages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}

        {!loading && !error && books.length === 0 && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-kindle-hover rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-kindle-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-kindle-dark mb-2">
                Welcome to Book Archive
              </h3>
              <p className="text-kindle-muted mb-6">
                Search millions of books and discover your next favorite read. 
                Enter a title, author, or ISBN to get started.
              </p>
            </div>
          </div>
        )}
      </div>

      {selectedBook && (
        <SummaryModal
          title={selectedBook.title}
          author={selectedBook.author}
          onClose={closeSummaryModal}
        />
      )}
    </div>
  );
}