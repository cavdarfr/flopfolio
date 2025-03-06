'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="max-w-md space-y-6">
        <h1 className="text-4xl font-bold text-red-600">Something went wrong</h1>
        
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-lg text-gray-700 mb-2">
            We apologize for the inconvenience. An unexpected error has occurred.
          </p>
          
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-3 bg-gray-100 rounded text-left overflow-auto max-h-40">
              <p className="text-sm font-mono text-red-800">{error.message}</p>
            </div>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => reset()}
            variant="default"
            size="lg"
          >
            Try again
          </Button>
          
          <Button 
            onClick={() => window.location.href = '/'}
            variant="outline"
            size="lg"
          >
            Go to homepage
          </Button>
        </div>
      </div>
    </div>
  );
} 