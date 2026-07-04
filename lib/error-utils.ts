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
  if (error instanceof Error) {
    return error.message;
  }

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
