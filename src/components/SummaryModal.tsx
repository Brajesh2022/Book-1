'use client';

import { useState, useEffect } from 'react';

interface SummaryModalProps {
  title: string;
  author: string;
  onClose: () => void;
}

export default function SummaryModal({ title, author, onClose }: SummaryModalProps) {
  const [summary, setSummary] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const generateSummary = async () => {
      try {
        setLoading(true);
        setError('');
        
        const response = await fetch('/api/summary', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title, author }),
        });

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || 'Failed to generate summary');
        }

        setSummary(result.data);
      } catch (error) {
        console.error('Summary generation error:', error);
        setError('Failed to generate summary. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    generateSummary();
  }, [title, author]);

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in" onClick={handleBackdropClick}>
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-scale-in">
        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b border-kindle-border">
          <div className="flex-1 pr-4">
            <h2 className="text-xl font-bold text-kindle-dark mb-1 flex items-center gap-2">
              <svg className="w-5 h-5 text-kindle-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              ✨ AI Summary
            </h2>
            <p className="text-kindle-muted text-sm">
              <span className="font-medium">{title}</span> by {author}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-kindle-muted hover:text-kindle-dark text-2xl font-light transition-colors duration-200 flex-shrink-0"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading && (
            <div className="text-center py-8">
              <div className="inline-flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-kindle-border rounded-full animate-spin border-t-kindle-accent mb-4"></div>
                <p className="text-kindle-muted">Generating AI summary...</p>
                <div className="loading-dots mt-2">
                  <div style={{ '--i': 0 } as React.CSSProperties}></div>
                  <div style={{ '--i': 1 } as React.CSSProperties}></div>
                  <div style={{ '--i': 2 } as React.CSSProperties}></div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <div className="w-12 h-12 mx-auto mb-4 bg-red-50 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="kindle-button-secondary px-4 py-2"
              >
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && summary && (
            <div className="prose prose-kindle max-w-none">
              <div className="whitespace-pre-wrap text-kindle-text leading-relaxed">
                {summary}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!loading && !error && summary && (
          <div className="p-6 border-t border-kindle-border bg-kindle-paper/50">
            <div className="flex items-center justify-between">
              <p className="text-xs text-kindle-muted">
                Summary generated by AI • May contain inaccuracies
              </p>
              <button
                onClick={onClose}
                className="kindle-button-primary px-4 py-2"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}