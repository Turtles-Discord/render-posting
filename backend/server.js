import tiktokService from './services/tiktokService.js';
import logger from './utils/logger.js';

app.get('/terms/tiktokrjGuNvRAwESoGlUOI19JJ8xI27Ysc0lu.txt', (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.send('tiktok-developers-site-verification=rjGuNvRAwESoGlUOI19JJ8xI27Ysc0lu');
});

// TikTok OAuth callback routes
app.get('/auth/tiktok/callback', async (req, res) => {
  try {
    const { code } = req.query;
    console.log('Callback received with code:', code);
    
    const tokenData = await tiktokService.exchangeCodeForToken(code);
    console.log('Token data received:', tokenData);
    
    // Send user data back to opener window
    const script = `
      <script>
        console.log('Callback received user data:', ${JSON.stringify(tokenData.data.user)});
        
        if (window.opener) {
          window.opener.postMessage({
            type: 'TIKTOK_AUTH_SUCCESS',
            userData: {
              display_name: "${tokenData.data.user.display_name}",
              avatar_url: "${tokenData.data.user.avatar_url || ''}"
            }
          }, "*");
          
          console.log('Sent data to opener, closing popup...');
          window.close();
        }
      </script>
    `;

    res.send(script);
  } catch (error) {
    console.error('TikTok auth error:', error);
    const script = `
      <script>
        console.error('Auth error:', ${JSON.stringify(error.message)});
        if (window.opener) {
          window.opener.postMessage({ type: 'TIKTOK_AUTH_ERROR', error: 'Authentication failed' }, "*");
          window.close();
        }
      </script>
    `;
    res.send(script);
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