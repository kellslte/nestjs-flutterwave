import { FlutterwaveModuleOptions, RetryOptions } from './interfaces';
import { HttpClient } from './http-client';

export abstract class BaseService {
  protected readonly httpClient: HttpClient;
  protected readonly options: FlutterwaveModuleOptions;

  constructor(options: FlutterwaveModuleOptions) {
    this.options = options;
    this.httpClient = new HttpClient();
  }

  protected getBaseUrl(): string {
    if (this.options.baseUrl) {
      return this.options.baseUrl;
    }
    
    const version = this.options.version || 'v3';
    return version === 'v4' 
      ? 'https://api.flutterwave.com/v4'
      : 'https://api.flutterwave.com/v3';
  }

  protected getHeaders(): Record<string, string> {
    return {
      Authorization: `Bearer ${this.options.secretKey}`,
      'Content-Type': 'application/json',
    };
  }

  protected getRetryOptions(): RetryOptions {
    return {
      retries: this.options.retries || 3,
      retryDelay: this.options.retryDelay || 1000,
      maxRetryDelay: this.options.maxRetryDelay || 10000,
      shouldRetry: this.options.shouldRetry,
    };
  }

  protected async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = this.buildUrl(endpoint, params);
    const response = await this.httpClient.request(
      {
        method: 'GET',
        url,
        headers: this.getHeaders(),
        timeout: this.options.timeout,
      },
      this.getRetryOptions(),
    );
    return response.data;
  }

  protected async post<T>(endpoint: string, data?: any): Promise<T> {
    const response = await this.httpClient.request(
      {
        method: 'POST',
        url: `${this.getBaseUrl()}${endpoint}`,
        headers: this.getHeaders(),
        body: data,
        timeout: this.options.timeout,
      },
      this.getRetryOptions(),
    );
    return response.data;
  }

  protected async put<T>(endpoint: string, data?: any): Promise<T> {
    const response = await this.httpClient.request(
      {
        method: 'PUT',
        url: `${this.getBaseUrl()}${endpoint}`,
        headers: this.getHeaders(),
        body: data,
        timeout: this.options.timeout,
      },
      this.getRetryOptions(),
    );
    return response.data;
  }

  protected async patch<T>(endpoint: string, data?: any): Promise<T> {
    const response = await this.httpClient.request(
      {
        method: 'PATCH',
        url: `${this.getBaseUrl()}${endpoint}`,
        headers: this.getHeaders(),
        body: data,
        timeout: this.options.timeout,
      },
      this.getRetryOptions(),
    );
    return response.data;
  }

  protected async delete<T>(endpoint: string): Promise<T> {
    const response = await this.httpClient.request(
      {
        method: 'DELETE',
        url: `${this.getBaseUrl()}${endpoint}`,
        headers: this.getHeaders(),
        timeout: this.options.timeout,
      },
      this.getRetryOptions(),
    );
    return response.data;
  }

  private buildUrl(endpoint: string, params?: Record<string, any>): string {
    const url = new URL(`${this.getBaseUrl()}${endpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }
}
