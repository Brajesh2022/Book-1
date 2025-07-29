'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Book } from '@/types/book';

interface BookCardProps {
  book: Book;
  onSummarize: (title: string, author: string) => void;
}

export default function BookCard({ book, onSummarize }: BookCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleImageError = () => {
    setImageError(true);
    setIsLoading(false);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleSummarizeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSummarize(book.title, book.author);
  };

  const handleDownloadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="kindle-card group animate-book-hover h-full flex flex-col overflow-hidden">
      {/* Book Cover */}
      <div className="relative aspect-[3/4] overflow-hidden bg-kindle-hover">
        {isLoading && (
          <div className="absolute inset-0 shimmer"></div>
        )}
        
        {!imageError ? (
          <Image
            src={book.poster}
            alt={`Cover of ${book.title}`}
            fill
            className={`object-cover transition-all duration-300 group-hover:scale-105 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onError={handleImageError}
            onLoad={handleImageLoad}
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-kindle-hover to-kindle-border flex items-center justify-center">
            <div className="text-center p-4">
              <svg className="w-12 h-12 mx-auto mb-2 text-kindle-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <p className="text-xs text-kindle-muted">No Image</p>
            </div>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Book Info */}
      <div className="flex-1 p-4 flex flex-col">
        <h3 
          className="font-bold text-lg leading-tight mb-2 text-kindle-dark line-clamp-2 group-hover:text-kindle-accent transition-colors duration-200"
          title={book.title}
        >
          {book.title}
        </h3>
        
        <p 
          className="text-kindle-muted text-sm mb-2 line-clamp-1"
          title={book.author}
        >
          by {book.author}
        </p>
        
        <p 
          className="text-kindle-muted text-xs italic mb-3 line-clamp-2 flex-1"
          title={book.description}
        >
          {book.description}
        </p>

        {/* Size info */}
        <div className="text-xs text-kindle-muted mb-3">
          <span className="inline-flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Size: {book.size}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2 border-t border-kindle-border">
          <button
            onClick={handleSummarizeClick}
            className="flex-1 kindle-button-secondary px-3 py-2 text-xs font-medium transition-all duration-200 hover:bg-kindle-accent hover:text-white group/btn"
            title="Generate AI summary"
          >
            <span className="flex items-center gap-1 justify-center">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              ✨ Summary
            </span>
          </button>
          
          <a
            href={book.downloadLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleDownloadClick}
            className="flex-1 kindle-button-primary px-3 py-2 text-xs font-medium transition-all duration-200 text-center"
            title="Download book"
          >
            <span className="flex items-center gap-1 justify-center">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}