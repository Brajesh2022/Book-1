'use client';

import { useState, FormEvent } from 'react';

interface SearchHeaderProps {
  onSearch: (query: string, page?: number) => void;
  loading?: boolean;
}

export default function SearchHeader({ onSearch, loading = false }: SearchHeaderProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <header className="bg-white border-b border-kindle-border shadow-sm">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-kindle-dark mb-3 font-serif">
            📚 Book Archive
          </h1>
          <p className="text-lg text-kindle-muted max-w-2xl mx-auto leading-relaxed">
            Discover millions of books with our beautiful, fast search. 
            Find your next favorite read in seconds.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="relative">
            <div className="flex rounded-lg border border-kindle-border bg-white shadow-sm hover:shadow-md transition-shadow duration-200 focus-within:ring-2 focus-within:ring-kindle-accent focus-within:border-kindle-accent">
              <div className="flex items-center pl-4">
                <svg className="w-5 h-5 text-kindle-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title, author, ISBN, or keywords..."
                className="flex-1 px-4 py-4 bg-transparent border-0 text-kindle-text placeholder-kindle-muted focus:outline-none text-lg"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="px-8 py-4 bg-kindle-accent text-white font-semibold rounded-r-lg hover:bg-kindle-accent/90 focus:outline-none focus:ring-2 focus:ring-kindle-accent focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Searching...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Search
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            {['Science Fiction', 'Fantasy', 'Mystery', 'Romance', 'Biography', 'History'].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => {
                  setQuery(suggestion);
                  onSearch(suggestion);
                }}
                className="px-3 py-1 text-sm bg-kindle-hover text-kindle-text rounded-full hover:bg-kindle-border transition-colors duration-200"
                disabled={loading}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}