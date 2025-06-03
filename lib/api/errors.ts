export type ErrorCode =
  | 'UNAUTHORIZED'
  | 'LIMIT_REACHED'
  | 'GENERATION_FAILED'
  | 'UPDATE_FAILED'
  | 'INVALID_REQUEST'
  | 'WEBHOOK_INVALID'
  | 'SUBSCRIPTION_ERROR';

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

export const handleApiError = (error: unknown) => {
  if (error instanceof GenerationError || error instanceof WebhookError) {
    return new Response(
      JSON.stringify({
        error: {
          message: error.message,
          code: error.code
        }
      }),
      {
        status: error.statusCode,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  console.error('Unhandled API error:', error);
  return new Response(
    JSON.stringify({
      error: {
        message: 'Internal server error',
        code: 'INTERNAL_ERROR'
      }
    }),
    {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    }
  );
}; 