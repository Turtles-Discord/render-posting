import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import tiktokService from '../services/tiktokService.js';
import logger from '../utils/logger.js';

const router = express.Router();

router.get('/auth-url', verifyToken, (req, res) => {
  try {
    const authUrl = tiktokService.getAuthUrl();
    res.json({ url: authUrl });
  } catch (error) {
    logger.error('Error generating auth URL:', error);
    res.status(500).json({ error: 'Failed to generate auth URL' });
  }
});

router.post('/upload', verifyToken, async (req, res) => {
  try {
    const { file, description } = req.body;
    // Get user's TikTok token from database
    const user = await User.findById(req.userId);
    const tiktokToken = user.tiktokToken;

    if (!tiktokToken) {
      throw new Error('TikTok account not connected');
    }

    const result = await tiktokService.uploadVideo(tiktokToken, file, description);
    res.json(result);
  } catch (error) {
    logger.error('Video upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router; 