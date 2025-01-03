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
    
    if (state !== process.env.CSRF_STATE) {
      return res.redirect('/dashboard?error=invalid_state');
    }

    const tokenData = await tiktokService.exchangeCodeForToken(code);
    
    // Send user data back to opener window
    const script = `
      <script>
        window.opener.postMessage({
          success: true,
          userData: {
            display_name: "${tokenData.data.user.display_name}",
            avatar_url: "${tokenData.data.user.avatar_url || ''}"
          }
        }, window.location.origin);
        window.close();
      </script>
    `;

    res.send(script);
  } catch (error) {
    logger.error('TikTok authentication failed', error);
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