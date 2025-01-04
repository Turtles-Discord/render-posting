import tiktokService from './services/tiktokService.js';
import logger from './utils/logger.js';

app.get('/terms/tiktokrjGuNvRAwESoGlUOI19JJ8xI27Ysc0lu.txt', (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.send('tiktok-developers-site-verification=rjGuNvRAwESoGlUOI19JJ8xI27Ysc0lu');
});

app.get('/api/auth/tiktok/callback', async (req, res) => {
  try {
    const { code, state } = req.query;
    console.log('Callback received with code:', code);
    console.log('Full URL:', req.originalUrl);
    
    if (!code) {
      throw new Error('No authorization code received');
    }
    
    const tokenData = await tiktokService.exchangeCodeForToken(code);
    console.log('Token data received:', tokenData);

    // Send a more detailed success response
    const script = `
      <script>
        if (window.opener) {
          try {
            window.opener.postMessage({
              type: 'TIKTOK_AUTH_SUCCESS',
              userData: ${JSON.stringify({
                display_name: tokenData.data.user.display_name,
                avatar_url: tokenData.data.user.avatar_url || '',
                access_token: tokenData.data.access_token
              })}
            }, "${process.env.CLIENT_URL}");
          } catch (e) {
            console.error('Error posting message:', e);
          }
          setTimeout(() => window.close(), 500);
        }
      </script>
    `;
    res.send(script);
  } catch (error) {
    console.error('Detailed TikTok auth error:', error);
    const errorScript = `
      <script>
        if (window.opener) {
          window.opener.postMessage({
            type: 'TIKTOK_AUTH_ERROR',
            error: 'Authentication failed: ${error.message}'
          }, "${process.env.CLIENT_URL}");
          setTimeout(() => window.close(), 2000);
        }
      </script>
    `;
    res.send(errorScript);
  }
});

app.get('/ping', (req, res) => {
  res.status(200).send('OK');
}); 