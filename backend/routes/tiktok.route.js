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

    const result = await tiktokService.uploadVideo(
      tiktokService.accessToken, 
      file, 
      description
    );
    
    res.json(result);
  } catch (error) {
    console.error('Upload error:', error);
    
    if (error.response?.status === 401) {
      try {
        const newTokens = await tiktokService.refreshAccessToken(tiktokService.refreshToken);
        tiktokService.accessToken = newTokens.access_token;
        tiktokService.refreshToken = newTokens.refresh_token;
        
        const result = await tiktokService.uploadVideo(
          tiktokService.accessToken, 
          file, 
          description
        );
        
        res.json(result);
      } catch (refreshError) {
        res.status(401).json({ error: 'Token refresh failed' });
      }
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

export default router; 