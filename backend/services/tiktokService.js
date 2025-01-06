import crypto from 'crypto';
import axios from 'axios';
import logger from '../utils/logger.js';
import tokenStorage from './tokenStorage.js';

class TiktokService {
  constructor() {
    this.apiUrl = 'https://open.tiktokapis.com/v2';
    this.authUrl = 'https://www.tiktok.com/v2/auth/authorize/';
    this.clientKey = process.env.TIKTOK_CLIENT_KEY;
    this.clientSecret = process.env.TIKTOK_CLIENT_SECRET;
    this.redirectUri = process.env.TIKTOK_REDIRECT_URI;
    this.clientUrl = process.env.CLIENT_URL;
  }

  generateStateToken() {
    const state = crypto.randomBytes(16).toString('hex');
    // Store state in memory or database for validation
    this.stateToken = state;
    return state;
  }

  validateStateToken(state) {
    return state === this.stateToken;
  }

  getAuthUrl() {
    const state = this.generateStateToken();
    const params = new URLSearchParams({
      client_key: this.clientKey,
      scope: 'user.info.basic,video.publish',
      response_type: 'code',
      redirect_uri: this.redirectUri,
      state: state
    });
    
    return `${this.authUrl}?${params.toString()}`;
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

  async refreshAccessToken(refreshToken) {
    try {
      const formData = new URLSearchParams();
      formData.append('client_key', this.clientKey);
      formData.append('client_secret', this.clientSecret);
      formData.append('grant_type', 'refresh_token');
      formData.append('refresh_token', refreshToken);

      const response = await axios({
        method: 'POST',
        url: `${this.apiUrl}/oauth/token/`,
        data: formData,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      if (response.status === 200) {
        return response.data;
      }
      throw new Error('Failed to refresh token');
    } catch (error) {
      logger.error('Token refresh failed:', error);
      throw error;
    }
  }

  async revokeToken(accessToken) {
    try {
      const formData = new URLSearchParams();
      formData.append('client_key', this.clientKey);
      formData.append('client_secret', this.clientSecret);
      formData.append('access_token', accessToken);

      const response = await axios({
        method: 'POST',
        url: `${this.apiUrl}/oauth/revoke/`,
        data: formData,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      return response.status === 200;
    } catch (error) {
      logger.error('Token revocation failed:', error);
      throw error;
    }
  }
}

export default new TiktokService(); 