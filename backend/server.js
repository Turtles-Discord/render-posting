import tiktokService from './services/tiktokService.js';
import tokenStorage from './services/tokenStorage.js';
import { authLimiter } from './middleware/rateLimiter.js';
import logger from './utils/logger.js';

app.get('/terms/tiktokrjGuNvRAwESoGlUOI19JJ8xI27Ysc0lu.txt', (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.send('tiktok-developers-site-verification=rjGuNvRAwESoGlUOI19JJ8xI27Ysc0lu');
});

app.get('/api/auth/tiktok/callback', async (req, res) => {
  try {
    const { code, state } = req.query;
    logger.info('🎯 Callback received:', { code });
    
    if (!code) {
      throw new Error('No authorization code received');
    }
    
    const tokenData = await tiktokService.exchangeCodeForToken(code);
    logger.info('✅ Token exchange successful', tokenData);

    const userData = {
      display_name: tokenData.user?.display_name || 'TikTok User',
      avatar_url: tokenData.user?.avatar_url || '',
      access_token: tokenData.access_token,
      open_id: tokenData.open_id,
      refresh_token: tokenData.refresh_token,
      expires_in: tokenData.expires_in
    };

    // Send HTML response with postMessage
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Authentication Complete</title>
          <script>
            window.onload = function() {
              if (window.opener) {
                window.opener.postMessage({
                  type: 'TIKTOK_AUTH_SUCCESS',
                  userData: ${JSON.stringify(userData)}
                }, '${process.env.CLIENT_URL}');
                
                // Close window after message is sent
                setTimeout(() => window.close(), 1000);
              }
            }
          </script>
        </head>
        <body style="background: #1a1a1a; color: white; font-family: system-ui; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0;">
          <div style="text-align: center;">
            <h1>Authentication Complete</h1>
            <p>You can close this window now.</p>
          </div>
        </body>
      </html>
    `;
    
    res.send(html);
  } catch (error) {
    logger.error('❌ Auth error:', error);
    const errorHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Authentication Failed</title>
          <script>
            window.onload = function() {
              if (window.opener) {
                window.opener.postMessage({
                  type: 'TIKTOK_AUTH_ERROR',
                  error: 'Authentication failed: ${error.message}'
                }, '${process.env.CLIENT_URL}');
                setTimeout(() => window.close(), 1000);
              }
            }
          </script>
        </head>
        <body style="background: #1a1a1a; color: white; font-family: system-ui; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0;">
          <div style="text-align: center;">
            <h1>Authentication Failed</h1>
            <p>${error.message}</p>
          </div>
        </body>
      </html>
    `;
    res.send(errorHtml);
  }
});

app.get('/ping', (req, res) => {
  res.status(200).send('OK');
}); 