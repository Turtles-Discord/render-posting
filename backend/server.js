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
    logger.info('🎯 Callback received:', { code });
    
    if (!code) {
      throw new Error('No authorization code received');
    }
    
    const tokenData = await tiktokService.exchangeCodeForToken(code);
    logger.info('✅ Token exchange successful');

    // Set secure headers
    res.setHeader('Content-Security-Policy', "default-src 'self' 'unsafe-inline'");
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');

    const script = `
      <script>
        (function() {
          if (!window.opener) {
            document.body.innerHTML = '<h1>Authentication Error</h1><p>No opener window found</p>';
            return;
          }

          try {
            const userData = {
              display_name: ${JSON.stringify(tokenData.user.display_name || 'TikTok User')},
              avatar_url: ${JSON.stringify(tokenData.user.avatar_url || '')},
              access_token: ${JSON.stringify(tokenData.access_token)},
              open_id: ${JSON.stringify(tokenData.open_id)},
              refresh_token: ${JSON.stringify(tokenData.refresh_token)},
              expires_in: ${JSON.stringify(tokenData.expires_in)}
            };

            window.opener.postMessage({
              type: 'TIKTOK_AUTH_SUCCESS',
              userData: userData
            }, "${process.env.CLIENT_URL}");
            
            // Store in localStorage
            window.opener.localStorage.setItem('tiktokUser', JSON.stringify(userData));
            
            setTimeout(() => window.close(), 1000);
          } catch (error) {
            console.error('Auth error:', error);
            window.opener.postMessage({
              type: 'TIKTOK_AUTH_ERROR',
              error: error.message
            }, "${process.env.CLIENT_URL}");
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
    res.send(`
      <script>
        if (window.opener) {
          window.opener.postMessage({
            type: 'TIKTOK_AUTH_ERROR',
            error: 'Authentication failed: ' + ${JSON.stringify(error.message)}
          }, "${process.env.CLIENT_URL}");
          setTimeout(() => window.close(), 1000);
        }
      </script>
    `);
  }
});

app.get('/ping', (req, res) => {
  res.status(200).send('OK');
}); 