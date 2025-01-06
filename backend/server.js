import tiktokService from './services/tiktokService.js';
import logger from './utils/logger.js';

app.get('/terms/tiktokrjGuNvRAwESoGlUOI19JJ8xI27Ysc0lu.txt', (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.send('tiktok-developers-site-verification=rjGuNvRAwESoGlUOI19JJ8xI27Ysc0lu');
});

app.get('/api/auth/tiktok/callback', async (req, res) => {
  try {
    const { code, state } = req.query;
    logger.info('🎯 Callback received:', { code, state });
    
    // Add security headers
    res.setHeader('Permissions-Policy', 'unload=()');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
    
    if (!code) {
      throw new Error('No authorization code received');
    }
    
    logger.info('🔄 Exchanging code for token...');
    const tokenData = await tiktokService.exchangeCodeForToken(code);
    logger.info('✅ Token data received:', tokenData);

    const clientUrl = process.env.CLIENT_URL;
    logger.info('🔗 Client URL for postMessage:', clientUrl);

    const script = `
      <script>
        (function() {
          console.log('🎉 Auth callback received');
          
          // Ensure we're running in the correct context
          if (!window.opener) {
            console.error('❌ No opener window found');
            document.body.innerHTML = '<h1>Please close this window and try again</h1>';
            return;
          }

          const message = {
            type: 'TIKTOK_AUTH_SUCCESS',
            userData: ${JSON.stringify({
              display_name: tokenData.data?.user?.display_name || 'TikTok User',
              avatar_url: tokenData.data?.user?.avatar_url || '',
              access_token: tokenData.data?.access_token,
              open_id: tokenData.data?.open_id
            })}
          };
          
          const targetOrigin = "${clientUrl}";
          console.log('📤 Preparing to send message:', message);
          console.log('🎯 Target origin:', targetOrigin);
          
          try {
            window.opener.postMessage(message, targetOrigin);
            console.log('✅ Message sent successfully');
          } catch (error) {
            console.error('❌ Error sending message:', error);
            document.body.innerHTML = '<h1>Error completing authentication</h1><p>' + error.message + '</p>';
            return;
          }

          console.log('⏳ Waiting before closing...');
          setTimeout(() => {
            console.log('🚪 Closing popup window...');
            window.close();
          }, 2000);
        })();
      </script>
      <body>
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
          window.close();
        }
      </script>
    `;
    res.send(script);
  }
});

app.get('/ping', (req, res) => {
  res.status(200).send('OK');
}); 