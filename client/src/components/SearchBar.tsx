import React, { useState, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  isLoading = false,
  placeholder = "Search by title, author, ISBN..."
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
    }
  }, [query, onSearch, isLoading]);

  const handleClear = useCallback(() => {
    setQuery('');
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-2xl mx-auto"
    >
      <form onSubmit={handleSubmit} className="relative">
        <div className={`relative flex items-center transition-all duration-300 ${
          isFocused ? 'transform scale-105' : ''
        }`}>
          <div className="absolute left-4 z-10">
            <Search 
              className={`w-5 h-5 transition-colors duration-200 ${
                isFocused ? 'text-kindle-blue' : 'text-gray-400'
              }`} 
            />
          </div>
          
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            disabled={isLoading}
            className={`search-input pl-12 pr-12 shadow-kindle ${
              isFocused ? 'ring-2 ring-kindle-blue ring-opacity-50' : ''
            } ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          />
          
          {query && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              type="button"
              onClick={handleClear}
              className="absolute right-4 z-10 p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <X className="w-4 h-4" />
            </motion.button>
          )}
        </div>
        
        <motion.button
          type="submit"
          disabled={!query.trim() || isLoading}
          className={`mt-4 w-full btn-kindle disabled:opacity-50 disabled:cursor-not-allowed ${
            isLoading ? 'animate-pulse' : ''
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Searching...
            </span>
          ) : (
            'Search Books'
          )}
        </motion.button>
      </form>
    </motion.div>
  );
};