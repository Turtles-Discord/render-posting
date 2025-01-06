import express from 'express';
import { authLimiter, tokenLimiter } from '../middleware/rateLimiter.js';
import tiktokService from '../services/tiktokService.js';
import tokenStorage from '../services/tokenStorage.js';

const router = express.Router();

router.get('/auth-url', authLimiter, (req, res) => {
  try {
    const authUrl = tiktokService.getAuthUrl();
    res.json({ url: authUrl });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate auth URL' });
  }
});

router.post('/refresh-token', tokenLimiter, async (req, res) => {
  try {
    const { refreshToken, userId } = req.body;
    const newTokens = await tiktokService.refreshAccessToken(refreshToken);
    tokenStorage.storeRefreshToken(userId, newTokens.refresh_token, newTokens.expires_in);
    res.json(newTokens);
  } catch (error) {
    res.status(401).json({ error: 'Failed to refresh token' });
  }
});

router.post('/revoke-token', tokenLimiter, async (req, res) => {
  try {
    const { accessToken } = req.body;
    await tiktokService.revokeToken(accessToken);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to revoke token' });
  }
});

export default router; 