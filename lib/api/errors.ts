export type ErrorCode =
  | 'UNAUTHORIZED'
  | 'LIMIT_REACHED'
  | 'GENERATION_FAILED'
  | 'UPDATE_FAILED'
  | 'INVALID_REQUEST'
  | 'WEBHOOK_INVALID'
  | 'SUBSCRIPTION_ERROR'
  | 'USER_NOT_FOUND'
  | 'SAVE_FAILED'
  | 'EXTRACTION_FAILED'
  | 'INVALID_URL'
  | 'UNKNOWN_ERROR';

export class GenerationError extends Error {
  constructor(
    message: string,
    public code: ErrorCode,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'GenerationError';
  }
}

export class WebhookError extends Error {
  constructor(
    message: string,
    public code: ErrorCode,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = 'WebhookError';
  }
}

export function handleApiError(error: unknown) {
  if (error instanceof GenerationError) {
    return Response.json({
      success: false,
      error: {
        message: error.message,
        code: error.code
      }
    }, {
      status: error.statusCode
    });
  }

  console.error('Unhandled API error:', error);
  return Response.json({
    success: false,
    error: {
      message: 'An unexpected error occurred',
      code: 'UNKNOWN_ERROR'
    }
  }, {
    status: 500
  });
} 