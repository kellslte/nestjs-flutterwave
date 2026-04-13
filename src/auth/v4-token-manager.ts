import { FlutterwaveError } from '../errors';
import { FLUTTERWAVE_V4_OAUTH_TOKEN_URL } from '../constants';
import { FlutterwaveModuleOptions } from '../interfaces';

interface V4TokenCacheEntry {
  accessToken: string;
  expiresAtMs: number;
}

export class V4TokenManager {
  private static readonly cache = new Map<string, V4TokenCacheEntry>();

  private static readonly inFlight = new Map<string, Promise<string>>();

  static async getAccessToken(options: FlutterwaveModuleOptions): Promise<string> {
    if (options.secretKey && !options.clientId && !options.clientSecret) {
      return options.secretKey;
    }

    const clientId = options.clientId;
    const clientSecret = options.clientSecret;
    if (!clientId || !clientSecret) {
      throw new FlutterwaveError(
        'v4 configuration requires clientId/clientSecret or a pre-provisioned secretKey token',
        0,
        'INVALID_V4_AUTH_CONFIGURATION',
      );
    }

    const cacheKey = `${clientId}:${clientSecret}`;
    const bufferSeconds = options.oauthTokenRefreshBufferSeconds ?? 60;
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() + bufferSeconds * 1000 < cached.expiresAtMs) {
      return cached.accessToken;
    }

    const activeRequest = this.inFlight.get(cacheKey);
    if (activeRequest) {
      return activeRequest;
    }

    const request = this.fetchAccessToken(options, clientId, clientSecret)
      .then((result) => {
        this.cache.set(cacheKey, result);
        return result.accessToken;
      })
      .finally(() => {
        this.inFlight.delete(cacheKey);
      });

    this.inFlight.set(cacheKey, request);
    return request;
  }

  private static async fetchAccessToken(
    options: FlutterwaveModuleOptions,
    clientId: string,
    clientSecret: string,
  ): Promise<V4TokenCacheEntry> {
    const tokenUrl = options.oauthTokenUrl || FLUTTERWAVE_V4_OAUTH_TOKEN_URL;
    const body = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    });

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });

    const responseBody = await response.json().catch(() => ({}));
    if (!response.ok || !responseBody.access_token) {
      throw new FlutterwaveError(
        responseBody?.error_description || responseBody?.message || 'Unable to retrieve v4 OAuth token',
        response.status || 0,
        'OAUTH_TOKEN_FETCH_FAILED',
        responseBody,
      );
    }

    const expiresIn = Number(responseBody.expires_in ?? 600);
    return {
      accessToken: String(responseBody.access_token),
      expiresAtMs: Date.now() + expiresIn * 1000,
    };
  }
}
