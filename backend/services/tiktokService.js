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
        redirect_uri: this.redirectUri
      });

      const response = await axios({
        method: 'POST',
        url: `${this.apiUrl}/oauth/token/`,
        data: formData,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Cache-Control': 'no-cache'
        }
      });

      // Get user info with the access token
      const userResponse = await axios({
        method: 'GET',
        url: `${this.apiUrl}/user/info/`,
        headers: {
          'Authorization': `Bearer ${response.data.access_token}`
        }
      });

      return {
        ...response.data,
        user: userResponse.data.data
      };
    } catch (error) {
      logger.error('❌ Token exchange error:', error);
      throw error;
    }
  }

  async uploadVideo(accessToken, videoFile, description) {
    try {
      // First, initiate upload
      const initResponse = await axios.post(
        `${this.apiUrl}/video/init/`,
        { source_info: { source: 'FILE_UPLOAD' } },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Upload the video chunks
      const uploadResponse = await axios.post(
        initResponse.data.upload_url,
        videoFile,
        {
          headers: {
            'Content-Type': 'video/mp4',
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      // Complete the upload
      const publishResponse = await axios.post(
        `${this.apiUrl}/video/publish/`,
        {
          upload_id: initResponse.data.upload_id,
          description: description,
          privacy_level: 'PUBLIC'
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return publishResponse.data;
    } catch (error) {
      logger.error('Error uploading video:', error);
      throw error;
    }
  }

  async refreshAccessToken(refreshToken) {
    try {
      logger.info('🔄 Refreshing access token...');
      
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

      logger.info('✅ Token refresh successful');
      return response.data;
    } catch (error) {
      logger.error('❌ Token refresh failed:', error);
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

  // Method to initialize with hardcoded tokens
  initializeWithTokens(accessToken, refreshToken) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    
    // Set up automatic refresh before token expires
    this.setupTokenRefresh();
    return this;
  }

  // Set up automatic token refresh
  setupTokenRefresh() {
    // Refresh 5 minutes before expiration
    const refreshInterval = (3600 - 300) * 1000; // 55 minutes
    
    setInterval(async () => {
      try {
        const newTokens = await this.refreshAccessToken(this.refreshToken);
        this.accessToken = newTokens.access_token;
        this.refreshToken = newTokens.refresh_token;
        
        logger.info('🔄 Token refreshed automatically');
      } catch (error) {
        logger.error('❌ Auto-refresh failed:', error);
      }
    }, refreshInterval);
  }
}

export default new TiktokService(); 