import tiktokService from './services/tiktokService.js';
import tokenStorage from './services/tokenStorage.js';
import { authLimiter } from './middleware/rateLimiter.js';
import logger from './utils/logger.js';

app.get('/terms/tiktokrjGuNvRAwESoGlUOI19JJ8xI27Ysc0lu.txt', (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.send('tiktok-developers-site-verification=rjGuNvRAwESoGlUOI19JJ8xI27Ysc0lu');
});

app.get('/api/auth/tiktok/callback', authLimiter, async (req, res) => {
  try {
    const { code, state } = req.query;
    logger.info('🎯 Callback received:', { code, state });
    
    if (!tokenStorage.validateStateToken(state)) {
      throw new Error('Invalid state token');
    }
    
    if (!code) {
      throw new Error('No authorization code received');
    }
    
    const tokenData = await tiktokService.exchangeCodeForToken(code);
    
    res.setHeader('Content-Security-Policy', "default-src 'self' 'unsafe-inline'");
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Permissions-Policy', 'unload=()');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');

    if (tokenData.data?.refresh_token && tokenData.data?.open_id) {
      tokenStorage.storeRefreshToken(
        tokenData.data.open_id,
        tokenData.data.refresh_token,
        tokenData.data.expires_in
      );
    }

    const script = `
      <script>
        (function() {
          if (!window.opener) {
            document.body.innerHTML = '<h1>Authentication Error</h1><p>No opener window found</p>';
            return;
          }

          try {
            window.opener.postMessage({
              type: 'TIKTOK_AUTH_SUCCESS',
              userData: ${JSON.stringify({
                display_name: tokenData.data?.user?.display_name || 'TikTok User',
                avatar_url: tokenData.data?.user?.avatar_url || '',
                access_token: tokenData.data?.access_token,
                open_id: tokenData.data?.open_id,
                refresh_token: tokenData.data?.refresh_token,
                expires_in: tokenData.data?.expires_in
              })}
            }, "${process.env.CLIENT_URL}");
            
            setTimeout(() => window.close(), 2000);
          } catch (error) {
            document.body.innerHTML = '<h1>Authentication Error</h1><p>' + error.message + '</p>';
          }
        })();
      </script>
      <body style="background: #1a1a1a; color: white; font-family: system-ui;">
        <h1>Authentication Complete</h1>
        <p>This window will close automatically...</p>
      </body>
    `;
    res.send(script);
  } catch (error) {
    logger.error('❌ Auth error:', error);
    const script = `
      <script>
        console.error('Auth failed:', ${JSON.stringify(error.message)});
        if (window.opener) {
          window.opener.postMessage({
            type: 'TIKTOK_AUTH_ERROR',
            error: 'Authentication failed: ' + ${JSON.stringify(error.message)}
          }, "${process.env.CLIENT_URL}");
          setTimeout(() => window.close(), 2000);
        }
      </script>
    `;
    res.send(script);
  }
});

app.get('/ping', (req, res) => {
  res.status(200).send('OK');
}); 