import tiktokService from './services/tiktokService.js';
import logger from './utils/logger.js';

app.get('/terms/tiktokrjGuNvRAwESoGlUOI19JJ8xI27Ysc0lu.txt', (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.send('tiktok-developers-site-verification=rjGuNvRAwESoGlUOI19JJ8xI27Ysc0lu');
});

app.get('/api/auth/tiktok/callback', async (req, res) => {
  try {
    const { code, state } = req.query;
    console.log('🎯 Callback received:', {
      code,
      state,
      fullUrl: req.originalUrl
    });
    
    if (!code) {
      console.error('❌ No authorization code received');
      throw new Error('No authorization code received');
    }
    
    console.log('🔄 Exchanging code for token...');
    const tokenData = await tiktokService.exchangeCodeForToken(code);
    console.log('✅ Token data received:', tokenData);

    if (!tokenData.data || !tokenData.data.access_token) {
      console.error('❌ Invalid token data received');
      throw new Error('Invalid token data received');
    }

    console.log('📝 Preparing success response...');
    const script = `
      <script>
        console.log('🎉 TikTok auth callback successful');
        try {
          console.log('📤 Sending success message to opener');
          window.opener.postMessage({
            type: 'TIKTOK_AUTH_SUCCESS',
            userData: ${JSON.stringify({
              display_name: tokenData.data.user.display_name || 'TikTok User',
              avatar_url: tokenData.data.user.avatar_url || '',
              access_token: tokenData.data.access_token,
              open_id: tokenData.data.open_id
            })}
          }, "${process.env.CLIENT_URL}");
          console.log('✅ Message sent successfully');
        } catch (e) {
          console.error('❌ Error posting message:', e);
        }
        console.log('🚪 Closing popup window');
        window.close();
      </script>
    `;
    res.send(script);
  } catch (error) {
    console.error('❌ TikTok auth error:', {
      error: error.message,
      response: error.response?.data,
      stack: error.stack
    });
    
    const script = `
      <script>
        console.error('❌ TikTok auth failed:', ${JSON.stringify(error.message)});
        window.opener.postMessage({
          type: 'TIKTOK_AUTH_ERROR',
          error: 'Authentication failed: ${error.message}'
        }, "${process.env.CLIENT_URL}");
        console.log('🚪 Closing popup window');
        window.close();
      </script>
    `;
    res.send(script);
  }
});

app.get('/ping', (req, res) => {
  res.status(200).send('OK');
}); 