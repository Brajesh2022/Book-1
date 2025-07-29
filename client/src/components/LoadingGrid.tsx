import React from 'react';
import { motion } from 'framer-motion';

interface LoadingGridProps {
  count?: number;
}

export const LoadingGrid: React.FC<LoadingGridProps> = ({ count = 12 }) => {
  return (
    <div className="books-grid">
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={`loading-${index}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.4, 
            delay: index * 0.05,
            ease: "easeOut"
          }}
          className="book-card"
        >
          {/* Cover Skeleton */}
          <div className="shimmer w-full h-48 rounded-t-kindle" />
          
          {/* Content Skeleton */}
          <div className="p-4 space-y-3">
            {/* Title */}
            <div className="shimmer h-5 w-full rounded" />
            <div className="shimmer h-5 w-3/4 rounded" />
            
            {/* Author */}
            <div className="shimmer h-4 w-1/2 rounded" />
            
            {/* Description */}
            <div className="space-y-2">
              <div className="shimmer h-3 w-full rounded" />
              <div className="shimmer h-3 w-5/6 rounded" />
            </div>
            
            {/* Size */}
            <div className="shimmer h-3 w-1/3 rounded" />
          </div>
          
          {/* Actions Skeleton */}
          <div className="px-4 pb-4 bg-gray-50 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <div className="shimmer h-4 w-20 rounded" />
              <div className="shimmer h-4 w-16 rounded" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};