import tiktokService from './services/tiktokService.js';
import logger from './utils/logger.js';

app.get('/terms/tiktokrjGuNvRAwESoGlUOI19JJ8xI27Ysc0lu.txt', (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.send('tiktok-developers-site-verification=rjGuNvRAwESoGlUOI19JJ8xI27Ysc0lu');
});

app.get('/api/auth/tiktok/callback', async (req, res) => {
  try {
    const { code } = req.query;
    console.log('Full callback URL:', req.originalUrl);
    console.log('Query parameters:', req.query);
    
    if (!code) {
      throw new Error('No authorization code received');
    }
    
    const tokenData = await tiktokService.exchangeCodeForToken(code);
    console.log('Token exchange response:', tokenData);
    
    const script = `
      <script>
        if (window.opener) {
          window.opener.postMessage({
            type: 'TIKTOK_AUTH_SUCCESS',
            userData: {
              display_name: "${tokenData.data.user.display_name}",
              avatar_url: "${tokenData.data.user.avatar_url || ''}"
            }
          }, "${process.env.CLIENT_URL}");
          setTimeout(() => window.close(), 1000);
        }
      </script>
    `;
    res.send(script);
  } catch (error) {
    console.error('Detailed error:', error);
    const script = `
      <script>
        if (window.opener) {
          window.opener.postMessage({
            type: 'TIKTOK_AUTH_ERROR',
            error: 'Authentication failed: ${error.message}'
          }, "${process.env.CLIENT_URL}");
          setTimeout(() => window.close(), 1000);
        }
      </script>
    `;
    res.send(script);
  }
});

app.get('/ping', (req, res) => {
  res.status(200).send('OK');
}); 