export class FlutterwaveError extends Error {
  constructor(
    message: string,
    public status: number = 0,
    public code: string = 'UNKNOWN_ERROR',
    public data?: any,
  ) {
    super(message);
    this.name = 'FlutterwaveError';
    Error.captureStackTrace(this, FlutterwaveError);
  }

  static fromResponse(response: any): FlutterwaveError {
    const message = response.message || response.error || 'Unknown Flutterwave error';
    const status = response.status || response.statusCode || 0;
    const code = response.code || 'API_ERROR';
    
    return new FlutterwaveError(message, status, code, response);
  }

  static fromHttpError(error: any): FlutterwaveError {
    if (error instanceof FlutterwaveError) {
      return error;
    }

    const message = error.message || 'HTTP request failed';
    const status = error.status || error.statusCode || 0;
    const code = error.code || 'HTTP_ERROR';
    
    return new FlutterwaveError(message, status, code, error);
  }
}
