import mongoose from 'mongoose';

/**
 * Standard response type for server actions
 */
export type ActionResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  errorLocation?: string; // Helps identify where the error occurred
};

/**
 * Handles MongoDB validation errors and returns a formatted error message
 */
export function handleValidationError(error: mongoose.Error.ValidationError): string {
  const validationErrors = Object.keys(error.errors).map(field => {
    return `${field}: ${error.errors[field].message}`;
  });
  
  return `Validation failed: ${validationErrors.join(', ')}`;
}

/**
 * Handles MongoDB duplicate key errors
 */
export function handleDuplicateKeyError(error: any): string {
  if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
    const mongoError = error as { 
      code: number; 
      keyPattern: Record<string, number>; 
      keyValue: Record<string, string>; 
    };
    
    const field = Object.keys(mongoError.keyPattern)[0];
    return `The ${field} "${mongoError.keyValue[field]}" is already taken.`;
  }
  
  return 'A duplicate key error occurred.';
}

/**
 * Simple error logger that includes location information
 */
export function logError(location: string, error: unknown): void {
  console.error(`[ERROR in ${location}]:`, error);
  
  if (error instanceof Error && error.stack) {
    console.error(`Stack trace:`, error.stack);
  }
}

/**
 * Get a readable error message from any error type
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof mongoose.Error.ValidationError) {
    // For validation errors, show which fields failed
    return `Validation failed: ${Object.keys(error.errors).join(', ')}`;
  }
  
  // For duplicate key errors (e.g., unique constraint violations)
  if (error instanceof Error && 
      typeof error === 'object' && 
      'code' in error && 
      error.code === 11000) {
    return 'This value is already taken. Please use a different one.';
  }
  
  // For standard errors
  if (error instanceof Error) {
    return error.message;
  }
  
  // For anything else
  return String(error);
}

/**
 * Creates a simple error response with location information
 */
export function createErrorResponse(error: unknown, location: string): ActionResponse {
  // Log the error for server-side debugging
  logError(location, error);
  
  return {
    success: false,
    error: getErrorMessage(error),
    errorLocation: location
  };
}

/**
 * Creates a success response
 */
export function createSuccessResponse<T>(data?: T): ActionResponse<T> {
  return {
    success: true,
    data
  };
} 