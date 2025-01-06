import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import tiktokService from '../services/tiktokService.js';
import logger from '../utils/logger.js';

const router = express.Router();

router.get('/auth-url', verifyToken, (req, res) => {
  try {
    const authUrl = tiktokService.getAuthUrl();
    console.log('Generated auth URL:', authUrl);
    res.json({ url: authUrl });
  } catch (error) {
    logger.error('Error generating auth URL:', error);
    res.status(500).json({ error: 'Failed to generate auth URL' });
  }
});

router.post('/upload', verifyToken, async (req, res) => {
  try {
    const { file, description } = req.body;
    if (!file) {
      throw new Error('No file provided');
    }

    const tiktokToken = req.headers.authorization?.split(' ')[1];
    if (!tiktokToken) {
      throw new Error('TikTok account not connected');
    }

    console.log('Starting upload with token:', tiktokToken);
    const result = await tiktokService.uploadVideo(tiktokToken, file, description);
    console.log('Upload result:', result);
    res.json(result);
  } catch (error) {
    console.error('Detailed upload error:', error);
    res.status(500).json({ 
      error: error.message,
      details: error.response?.data || 'Unknown error'
    });
  }
});

export default router; 