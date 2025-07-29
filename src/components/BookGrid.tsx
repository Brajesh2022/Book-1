'use client';

import { Book } from '@/types/book';
import BookCard from './BookCard';

interface BookGridProps {
  books: Book[];
  onSummarize: (title: string, author: string) => void;
}

export default function BookGrid({ books, onSummarize }: BookGridProps) {
  if (books.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto mb-4 bg-kindle-hover rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-kindle-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-kindle-dark mb-2">No books found</h3>
        <p className="text-kindle-muted">Try adjusting your search terms or browse by category.</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
        {books.map((book, index) => (
          <div 
            key={`${book.title}-${book.author}-${index}`}
            className="animate-slide-up"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <BookCard book={book} onSummarize={onSummarize} />
          </div>
        ))}
      </div>
    </div>
  );
}