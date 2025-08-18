import {
  HttpRequestOptions,
  HttpResponse,
  HttpError,
  RetryOptions,
} from '../../src/interfaces';

describe('HTTP Interfaces', () => {
  describe('HttpRequestOptions', () => {
    it('should have required properties with correct types', () => {
      const requestOptions: HttpRequestOptions = {
        method: 'POST',
        url: 'https://api.example.com/test',
        headers: { 'Content-Type': 'application/json' },
        body: { key: 'value' },
        timeout: 30000,
      };

      expect(requestOptions.method).toBe('POST');
      expect(requestOptions.url).toBe('https://api.example.com/test');
      expect(requestOptions.headers).toEqual({ 'Content-Type': 'application/json' });
      expect(requestOptions.body).toEqual({ key: 'value' });
      expect(requestOptions.timeout).toBe(30000);
    });

    it('should allow all HTTP methods', () => {
      const methods: Array<'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'> = [
        'GET',
        'POST',
        'PUT',
        'DELETE',
        'PATCH',
      ];

      methods.forEach((method) => {
        const requestOptions: HttpRequestOptions = {
          method,
          url: 'https://api.example.com/test',
        };

        expect(requestOptions.method).toBe(method);
      });
    });

    it('should make headers and body optional', () => {
      const requestOptions: HttpRequestOptions = {
        method: 'GET',
        url: 'https://api.example.com/test',
      };

      expect(requestOptions.method).toBe('GET');
      expect(requestOptions.url).toBe('https://api.example.com/test');
      expect(requestOptions.headers).toBeUndefined();
      expect(requestOptions.body).toBeUndefined();
      expect(requestOptions.timeout).toBeUndefined();
    });
  });

  describe('HttpResponse', () => {
    it('should have required properties with correct types', () => {
      const response: HttpResponse<{ data: string }> = {
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' },
        data: { data: 'test response' },
      };

      expect(response.status).toBe(200);
      expect(response.statusText).toBe('OK');
      expect(response.headers).toEqual({ 'content-type': 'application/json' });
      expect(response.data).toEqual({ data: 'test response' });
    });

    it('should support generic data type', () => {
      const stringResponse: HttpResponse<string> = {
        status: 200,
        statusText: 'OK',
        headers: {},
        data: 'string response',
      };

      const numberResponse: HttpResponse<number> = {
        status: 200,
        statusText: 'OK',
        headers: {},
        data: 42,
      };

      expect(typeof stringResponse.data).toBe('string');
      expect(typeof numberResponse.data).toBe('number');
    });
  });

  describe('HttpError', () => {
    it('should have required properties with correct types', () => {
      const error: HttpError = {
        status: 400,
        statusText: 'Bad Request',
        message: 'Invalid request data',
        data: { field: 'email', issue: 'required' },
      };

      expect(error.status).toBe(400);
      expect(error.statusText).toBe('Bad Request');
      expect(error.message).toBe('Invalid request data');
      expect(error.data).toEqual({ field: 'email', issue: 'required' });
    });

    it('should make data property optional', () => {
      const error: HttpError = {
        status: 500,
        statusText: 'Internal Server Error',
        message: 'Something went wrong',
      };

      expect(error.status).toBe(500);
      expect(error.statusText).toBe('Internal Server Error');
      expect(error.message).toBe('Something went wrong');
      expect(error.data).toBeUndefined();
    });
  });

  describe('RetryOptions', () => {
    it('should have required properties with correct types', () => {
      const retryOptions: RetryOptions = {
        retries: 3,
        retryDelay: 1000,
        maxRetryDelay: 10000,
        shouldRetry: (error: HttpError) => error.status >= 500,
      };

      expect(retryOptions.retries).toBe(3);
      expect(retryOptions.retryDelay).toBe(1000);
      expect(retryOptions.maxRetryDelay).toBe(10000);
      expect(typeof retryOptions.shouldRetry).toBe('function');
    });

    it('should make shouldRetry property optional', () => {
      const retryOptions: RetryOptions = {
        retries: 3,
        retryDelay: 1000,
        maxRetryDelay: 10000,
      };

      expect(retryOptions.retries).toBe(3);
      expect(retryOptions.retryDelay).toBe(1000);
      expect(retryOptions.maxRetryDelay).toBe(10000);
      expect(retryOptions.shouldRetry).toBeUndefined();
    });

    it('should support custom retry logic', () => {
      const customRetryLogic = (error: HttpError) => {
        return error.status === 429 || error.status >= 500;
      };

      const retryOptions: RetryOptions = {
        retries: 5,
        retryDelay: 2000,
        maxRetryDelay: 15000,
        shouldRetry: customRetryLogic,
      };

      const mockError: HttpError = {
        status: 429,
        statusText: 'Too Many Requests',
        message: 'Rate limit exceeded',
      };

      expect(retryOptions.shouldRetry!(mockError)).toBe(true);
    });
  });
});
