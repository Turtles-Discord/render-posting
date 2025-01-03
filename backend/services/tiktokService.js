import axios from 'axios';
import logger from '../utils/logger.js';

class TiktokService {
  constructor() {
    this.authApiUrl = process.env.TIKTOK_AUTH_API_URL;
    this.apiUrl = process.env.TIKTOK_API_URL;
    this.clientKey = process.env.TIKTOK_CLIENT_KEY;
    this.clientSecret = process.env.TIKTOK_CLIENT_SECRET;
    this.redirectUri = process.env.CLIENT_URL + '/auth/tiktok/callback';
  }

  getAuthUrl() {
    const params = new URLSearchParams({
      client_key: this.clientKey,
      scope: 'user.info.basic,video.publish',
      response_type: 'code',
      redirect_uri: this.redirectUri,
      platform: 'web'
    });
    
    const baseUrl = 'https://www.tiktok.com/login';
    const authUrl = `https://www.tiktok.com/v2/auth/authorize/?${params.toString()}`;
    
    const loginParams = new URLSearchParams({
      lang: 'en',
      enter_method: 'web',
      enter_from: `dev_${this.clientKey}`,
      redirect_url: encodeURIComponent(authUrl),
      hide_left_icon: '0',
      type: '',
      no_cta_popup: '1'
    });
    
    return `${baseUrl}?${loginParams.toString()}`;
  }

  async exchangeCodeForToken(code) {
    try {
      logger.info('Exchanging code for TikTok access token');
      const response = await axios.post(`${this.apiUrl}oauth/access_token/`, {
        client_key: this.clientKey,
        client_secret: this.clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: this.redirectUri
      });
      
      logger.info('Successfully obtained TikTok access token');
      return response.data;
    } catch (error) {
      logger.error('Error exchanging code for token:', error);
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