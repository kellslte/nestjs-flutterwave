import { FlutterwaveModuleOptions, RetryOptions } from './interfaces';
import { HttpClient } from './http-client';
import {
  FLUTTERWAVE_API_BASE_URL,
  FLUTTERWAVE_V4_PRODUCTION_BASE_URL,
  FLUTTERWAVE_V4_SANDBOX_BASE_URL,
} from './constants';
import { V4TokenManager } from './auth/v4-token-manager';
import { FlutterwaveError } from './errors';
import { randomUUID } from 'node:crypto';

export abstract class BaseService {
  protected readonly httpClient: HttpClient;
  protected readonly options: FlutterwaveModuleOptions;

  constructor(options: FlutterwaveModuleOptions) {
    this.options = options;
    this.httpClient = new HttpClient();
  }

  protected isV4(): boolean {
    return this.options.version === 'v4';
  }

  protected getBaseUrl(): string {
    if (this.options.baseUrl) {
      return this.options.baseUrl;
    }

    if (this.isV4()) {
      return this.options.environment === 'production'
        ? FLUTTERWAVE_V4_PRODUCTION_BASE_URL
        : FLUTTERWAVE_V4_SANDBOX_BASE_URL;
    }

    return FLUTTERWAVE_API_BASE_URL;
  }

  protected async getHeaders(method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'): Promise<Record<string, string>> {
    const token = await this.getAuthorizationToken();
    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    if (this.isV4()) {
      if (this.options.defaultTraceId) {
        headers['X-Trace-Id'] = this.options.defaultTraceId;
      }
      if (this.options.defaultScenarioKey) {
        headers['X-Scenario-Key'] = this.options.defaultScenarioKey;
      }
      if (method === 'POST') {
        headers['X-Idempotency-Key'] = this.getIdempotencyKey();
      }
    }

    return headers;
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
        headers: await this.getHeaders('GET'),
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
        headers: await this.getHeaders('POST'),
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
        headers: await this.getHeaders('PUT'),
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
        headers: await this.getHeaders('PATCH'),
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
        headers: await this.getHeaders('DELETE'),
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

  private async getAuthorizationToken(): Promise<string> {
    if (this.isV4()) {
      return V4TokenManager.getAccessToken(this.options);
    }

    if (!this.options.secretKey) {
      throw new FlutterwaveError('secretKey is required for v3 requests', 0, 'MISSING_SECRET_KEY');
    }

    return this.options.secretKey;
  }

  private getIdempotencyKey(): string {
    if (this.options.idempotencyKeyFactory) {
      return this.options.idempotencyKeyFactory();
    }

    if (this.options.enforceV4IdempotencyKey) {
      throw new FlutterwaveError(
        'enforceV4IdempotencyKey is enabled but no idempotencyKeyFactory was provided',
        0,
        'MISSING_IDEMPOTENCY_KEY_FACTORY',
      );
    }

    return randomUUID().replace(/-/g, '');
  }
}
