export interface FlutterwaveModuleOptions {
    secretKey?: string;
    publicKey?: string;
    baseUrl?: string;
    version?: 'v3' | 'v4';
    environment?: 'sandbox' | 'production';
    clientId?: string;
    clientSecret?: string;
    oauthTokenUrl?: string;
    oauthTokenRefreshBufferSeconds?: number;
    idempotencyKeyFactory?: () => string;
    enforceV4IdempotencyKey?: boolean;
    defaultTraceId?: string;
    defaultScenarioKey?: string;
    timeout?: number;
    retries?: number;
    retryDelay?: number;
    maxRetryDelay?: number;
    shouldRetry?: (error: any) => boolean;
}

export interface FlutterwaveModuleAsyncOptions {
    imports?: any[];
    useFactory: (...args: any[]) => Promise<FlutterwaveModuleOptions> | FlutterwaveModuleOptions;
    inject?: any[];
}
