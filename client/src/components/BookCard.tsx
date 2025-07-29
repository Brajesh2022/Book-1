import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Sparkles, FileText, User } from 'lucide-react';
import { Book } from '../types';

interface BookCardProps {
  book: Book;
  onSummarize: (title: string, author: string) => void;
  index: number;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onSummarize, index }) => {
  const [imageError, setImageError] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);

  const handleImageError = () => {
    setImageError(true);
    setIsImageLoading(false);
  };

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  const handleSummarize = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSummarize(book.title, book.author);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.05,
        ease: "easeOut"
      }}
      className="book-card group"
      whileHover={{ 
        y: -4,
        transition: { duration: 0.2 }
      }}
    >
      <a 
        href={book.downloadLink} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block h-full"
      >
        {/* Book Cover */}
        <div className="relative overflow-hidden rounded-t-kindle bg-gray-100">
          {isImageLoading && (
            <div className="shimmer w-full h-48 rounded-t-kindle" />
          )}
          
          {!imageError ? (
            <img
              src={book.poster}
              alt={`Cover of ${book.title}`}
              onError={handleImageError}
              onLoad={handleImageLoad}
              className={`book-cover transition-transform duration-300 group-hover:scale-105 ${
                isImageLoading ? 'opacity-0' : 'opacity-100'
              }`}
            />
          ) : (
            <div className="w-full h-48 bg-gradient-to-br from-kindle-paper to-gray-200 flex items-center justify-center rounded-t-kindle">
              <FileText className="w-12 h-12 text-gray-400" />
            </div>
          )}
          
          {/* Format Badge */}
          <div className="absolute top-2 right-2">
            <span className="px-2 py-1 text-xs font-medium bg-kindle-orange text-white rounded-full">
              {book.format}
            </span>
          </div>
        </div>

        {/* Book Info */}
        <div className="p-4 flex-1 flex flex-col">
          <h3 
            className="font-semibold text-lg mb-2 text-kindle-charcoal line-clamp-2 group-hover:text-kindle-blue transition-colors duration-200"
            title={book.title}
          >
            {book.title}
          </h3>
          
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <User className="w-4 h-4 mr-1" />
            <p className="truncate" title={book.author}>
              {book.author}
            </p>
          </div>
          
          <p 
            className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1"
            title={book.description}
          >
            {book.description}
          </p>
          
          {/* File Size */}
          <div className="text-xs text-gray-500 mb-3">
            Size: {book.size}
          </div>
        </div>
      </a>

      {/* Action Buttons */}
      <div className="px-4 pb-4 bg-gray-50 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <button
            onClick={handleSummarize}
            className="flex items-center text-sm text-kindle-blue hover:text-blue-600 font-medium transition-colors duration-200 focus-visible-ring"
          >
            <Sparkles className="w-4 h-4 mr-1" />
            Summarize
          </button>
          
          <a
            href={book.downloadLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-sm text-kindle-blue hover:text-blue-600 font-medium transition-colors duration-200 focus-visible-ring"
          >
            <Download className="w-4 h-4 mr-1" />
            Download
          </a>
        </div>
      </div>
    </motion.div>
  );
};