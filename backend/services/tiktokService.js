import axios from 'axios';
import logger from '../utils/logger.js';

class TiktokService {
  constructor() {
    this.authApiUrl = process.env.TIKTOK_AUTH_API_URL;
    this.apiUrl = process.env.TIKTOK_API_URL;
    this.clientKey = process.env.TIKTOK_CLIENT_KEY;
    this.clientSecret = process.env.TIKTOK_CLIENT_SECRET;
    this.redirectUri = process.env.CLIENT_URL + '/api/auth/tiktok/callback';
  }

  getAuthUrl() {
    const params = new URLSearchParams({
      client_key: this.clientKey,
      scope: 'user.info.basic,video.publish',
      response_type: 'code',
      redirect_uri: this.redirectUri,
      state: Math.random().toString(36).substring(7)
    });
    
    return `https://www.tiktok.com/v2/auth/authorize/?${params.toString()}`;
  }

  async exchangeCodeForToken(code) {
    try {
      logger.info('Exchanging code for TikTok access token');
      const response = await axios.post('https://open.tiktokapis.com/v2/oauth/token/', {
        client_key: this.clientKey,
        client_secret: this.clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: this.redirectUri
      });
      
      logger.info('Token data:', response.data);
      return response.data;
    } catch (error) {
      logger.error('Token exchange error:', error.response?.data || error);
      throw error;
    }
  }

  async uploadVideo(accessToken, videoFile, description) {
    try {
      logger.info('Starting video upload to TikTok');
      const response = await axios.post(
        `${this.apiUrl}video/upload/`,
        {
          video: videoFile,
          description
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      logger.info('Successfully uploaded video to TikTok');
      return response.data;
    } catch (error) {
      logger.error('Error uploading video to TikTok:', {
        error: error.response?.data || error.message,
        description
      });
      throw error;
    }
  }
}

export default new TiktokService(); 