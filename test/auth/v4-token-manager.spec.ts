import { V4TokenManager } from '../../src/auth/v4-token-manager';

describe('V4TokenManager', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return secretKey directly when client credentials are not provided', async () => {
    const token = await V4TokenManager.getAccessToken({
      version: 'v4',
      secretKey: 'prefetched_token',
    });

    expect(token).toBe('prefetched_token');
  });

  it('should fetch OAuth token with client credentials', async () => {
    const fetchMock = jest.spyOn(global, 'fetch' as any).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        access_token: 'oauth_token',
        expires_in: 600,
      }),
    } as Response);

    const token = await V4TokenManager.getAccessToken({
      version: 'v4',
      clientId: 'cid',
      clientSecret: 'csecret',
      oauthTokenRefreshBufferSeconds: 0,
    });

    expect(token).toBe('oauth_token');
    expect(fetchMock).toHaveBeenCalled();
  });
});
