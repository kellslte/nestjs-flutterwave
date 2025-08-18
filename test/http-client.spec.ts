import { HttpClient } from '../src/http-client';
import { HttpRequestOptions, RetryOptions } from '../src/interfaces';
import { FlutterwaveError } from '../src/errors/flutterwave.error';

// Mock fetch globally
global.fetch = jest.fn();

describe('HttpClient', () => {
  let httpClient: HttpClient;
  const mockRetryOptions: RetryOptions = {
    retries: 2,
    retryDelay: 100,
    maxRetryDelay: 1000,
  };

  beforeEach(() => {
    httpClient = new HttpClient();
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(httpClient).toBeDefined();
  });

  describe('successful requests', () => {
    it('should make successful GET request', async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Map([['content-type', 'application/json']]),
        json: jest.fn().mockResolvedValue({ data: 'test' }),
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const options: HttpRequestOptions = {
        method: 'GET',
        url: 'https://api.test.com/test',
        headers: {},
        timeout: 5000,
      };

      const result = await httpClient.request(options, mockRetryOptions);

      expect(result.status).toBe(200);
      expect(result.data).toEqual({ data: 'test' });
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('should make successful POST request with body', async () => {
      const mockResponse = {
        ok: true,
        status: 201,
        statusText: 'Created',
        headers: new Map([['content-type', 'application/json']]),
        json: jest.fn().mockResolvedValue({ id: 1, name: 'test' }),
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const options: HttpRequestOptions = {
        method: 'POST',
        url: 'https://api.test.com/test',
        headers: {},
        body: { name: 'test' },
        timeout: 5000,
      };

      const result = await httpClient.request(options, mockRetryOptions);

      expect(result.status).toBe(201);
      expect(result.data).toEqual({ id: 1, name: 'test' });
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.test.com/test',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ name: 'test' }),
        }),
      );
    });
  });

  describe('error handling', () => {
    it('should throw FlutterwaveError for HTTP errors', async () => {
      const mockResponse = {
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        headers: new Map([['content-type', 'application/json']]),
        json: jest.fn().mockResolvedValue({ message: 'Bad request' }),
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const options: HttpRequestOptions = {
        method: 'GET',
        url: 'https://api.test.com/test',
        headers: {},
        timeout: 5000,
      };

      await expect(httpClient.request(options, mockRetryOptions)).rejects.toThrow(FlutterwaveError);
    });

    it('should handle network errors', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      const options: HttpRequestOptions = {
        method: 'GET',
        url: 'https://api.test.com/test',
        headers: {},
        timeout: 5000,
      };

      await expect(httpClient.request(options, mockRetryOptions)).rejects.toThrow(FlutterwaveError);
    });
  });

  describe('retry logic', () => {
    it('should retry on retryable errors', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        headers: new Map([['content-type', 'application/json']]),
        json: jest.fn().mockResolvedValue({ message: 'Server error' }),
      };

      (global.fetch as jest.Mock)
        .mockRejectedValueOnce(new Error('Server error'))
        .mockResolvedValueOnce(mockResponse);

      const options: HttpRequestOptions = {
        method: 'GET',
        url: 'https://api.test.com/test',
        headers: {},
        timeout: 5000,
      };

      const retryOptions: RetryOptions = {
        retries: 1,
        retryDelay: 100,
        maxRetryDelay: 1000,
      };

      await expect(httpClient.request(options, retryOptions)).rejects.toThrow(FlutterwaveError);
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    it('should not retry on non-retryable errors', async () => {
      const mockResponse = {
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        headers: new Map([['content-type', 'application/json']]),
        json: jest.fn().mockResolvedValue({ message: 'Bad request' }),
      };

      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const options: HttpRequestOptions = {
        method: 'GET',
        url: 'https://api.test.com/test',
        headers: {},
        timeout: 5000,
      };

      const retryOptions: RetryOptions = {
        retries: 2,
        retryDelay: 100,
        maxRetryDelay: 1000,
      };

      await expect(httpClient.request(options, retryOptions)).rejects.toThrow(FlutterwaveError);
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });
});
