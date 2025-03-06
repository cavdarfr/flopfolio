import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="max-w-md space-y-6">
        <h1 className="text-4xl font-bold text-gray-800">404 - Page Not Found</h1>
        
        <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-lg text-gray-700 mb-4">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/">
                Go to Homepage
              </Link>
            </Button>
            
            <Button variant="outline" asChild size="lg">
              <Link href="/dashboard">
                Go to Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 