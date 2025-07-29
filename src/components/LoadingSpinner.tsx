'use client';

interface LoadingSpinnerProps {
  message?: string;
}

export default function LoadingSpinner({ message = 'Searching for books...' }: LoadingSpinnerProps) {
  return (
    <div className="text-center py-16">
      <div className="inline-flex flex-col items-center">
        <div className="relative">
          {/* Outer rotating ring */}
          <div className="w-16 h-16 border-4 border-kindle-border rounded-full animate-spin border-t-kindle-accent"></div>
          
          {/* Inner pulsing dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 bg-kindle-accent rounded-full animate-pulse"></div>
          </div>
        </div>
        
        <p className="mt-4 text-kindle-muted font-medium">{message}</p>
        
        {/* Loading dots */}
        <div className="loading-dots mt-2">
          <div style={{ '--i': 0 } as React.CSSProperties}></div>
          <div style={{ '--i': 1 } as React.CSSProperties}></div>
          <div style={{ '--i': 2 } as React.CSSProperties}></div>
        </div>
      </div>
    </div>
  );
}