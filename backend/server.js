import tiktokService from './services/tiktokService.js';
import logger from './utils/logger.js';

app.get('/terms/tiktokrjGuNvRAwESoGlUOI19JJ8xI27Ysc0lu.txt', (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.send('tiktok-developers-site-verification=rjGuNvRAwESoGlUOI19JJ8xI27Ysc0lu');
});

// TikTok OAuth callback routes
app.get('/auth/tiktok/callback', async (req, res) => {
  try {
    const { code, state } = req.query;
    
    logger.info('Received TikTok callback', { state });

    if (state !== process.env.CSRF_STATE) {
      logger.error('Invalid CSRF state received');
      return res.redirect('/dashboard?error=invalid_state');
    }

    const tokenData = await tiktokService.exchangeCodeForToken(code);
    const userInfo = await tiktokService.getUserInfo(tokenData.access_token);

    // Send user data back to opener window
    const script = `
      <script>
        window.opener.postMessage({
          success: true,
          userData: ${JSON.stringify(userInfo)}
        }, "${process.env.CLIENT_URL}");
        window.close();
      </script>
    `;

    res.send(script);
  } catch (error) {
    logger.error('TikTok authentication failed', {
      error: error.response?.data || error.message
    });
    res.redirect('/dashboard?error=auth_failed');
  }
});

app.get('/api/auth/tiktok/callback', async (req, res) => {
  try {
    // Handle API callback
    const { code } = req.query;
    // Exchange code for access token
    // Return response
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Authentication failed' });
  }
});

app.get('/ping', (req, res) => {
  res.status(200).send('OK');
}); 