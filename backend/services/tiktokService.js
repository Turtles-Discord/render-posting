import axios from 'axios';
import logger from '../utils/logger.js';

class TiktokService {
  constructor() {
    this.authApiUrl = process.env.TIKTOK_AUTH_API_URL;
    this.apiUrl = process.env.TIKTOK_API_URL;
    this.clientKey = process.env.TIKTOK_CLIENT_KEY;
    this.clientSecret = process.env.TIKTOK_CLIENT_SECRET;
    this.redirectUri = process.env.TIKTOK_REDIRECT_URI || (process.env.CLIENT_URL + '/api/auth/tiktok/callback');
  }

  getAuthUrl() {
    const params = new URLSearchParams({
      client_key: this.clientKey,
      scope: 'user.info.basic,video.publish',
      response_type: 'code',
      redirect_uri: this.redirectUri,
      state: Math.random().toString(36).substring(7)
    });
    
    console.log('Generated redirect URI:', this.redirectUri); // Debug log
    return `https://www.tiktok.com/v2/auth/authorize/?${params.toString()}`;
  }

  async exchangeCodeForToken(code) {
    try {
      logger.info('🔄 Starting token exchange...');
      
      // Clean the code value - remove everything after *
      const cleanCode = code.split('*')[0];
      
      const formData = new URLSearchParams();
      formData.append('client_key', this.clientKey);
      formData.append('client_secret', this.clientSecret);
      formData.append('code', cleanCode);
      formData.append('grant_type', 'authorization_code');
      formData.append('redirect_uri', this.redirectUri);

      logger.info('📤 Token exchange request:', {
        code: cleanCode,
        redirect_uri: this.redirectUri
      });

      const response = await axios({
        method: 'POST',
        url: 'https://open.tiktokapis.com/v2/oauth/token/',
        data: formData,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Cache-Control': 'no-cache'
        },
        validateStatus: false // Don't throw on non-2xx responses
      });
      
      logger.info('📥 Token exchange response:', {
        status: response.status,
        data: response.data
      });

      if (response.status !== 200) {
        throw new Error(`Token exchange failed: ${JSON.stringify(response.data)}`);
      }

      return response.data;
    } catch (error) {
      logger.error('❌ Token exchange error:', {
        message: error.message,
        response: error.response?.data,
        code: code
      });
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