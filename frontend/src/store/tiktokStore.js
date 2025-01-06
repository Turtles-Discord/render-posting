import { create } from 'zustand';
import axios from 'axios';
import toast from 'react-hot-toast';

const savedUser = localStorage.getItem('tiktokUser');
const initialUser = savedUser ? JSON.parse(savedUser) : null;

export const useTiktokStore = create((set) => ({
  isConnecting: false,
  user: initialUser,
  error: null,

  connectTiktok: async () => {
    try {
      console.log('🚀 Starting TikTok connection process...');
      set({ isConnecting: true, error: null });
      
      console.log('📡 Fetching auth URL from server...');
      const response = await axios.get('/api/tiktok/auth-url');
      console.log('✅ Auth URL received:', response.data);
      
      const authUrl = response.data.url;
      console.log('🔗 Opening popup with URL:', authUrl);
      
      // Parse and validate redirect_uri from authUrl
      const urlParams = new URLSearchParams(new URL(authUrl).search);
      const redirectUri = urlParams.get('redirect_uri');
      console.log('🎯 Redirect URI:', redirectUri);
      
      // Get base URL from redirect URI
      const redirectOrigin = new URL(redirectUri).origin;
      console.log('🌐 Redirect Origin:', redirectOrigin);
      
      // Create allowed origins array
      const allowedOrigins = [
        process.env.CLIENT_URL,
        redirectOrigin,  // Use origin instead of full path
        'https://www.tiktok.com'
      ].filter(Boolean);
      
      console.log('✅ Allowed origins:', allowedOrigins);

      const width = 600;
      const height = 800;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;

      const authPromise = new Promise((resolve, reject) => {
        let popupCheckInterval;
        
        const handleMessage = (event) => {
          console.log('📨 Message received from:', event.origin);
          console.log('📦 Message data:', event.data);
          
          // Check if origin is allowed
          if (!allowedOrigins.includes(event.origin)) {
            console.log(`⚠️ Message from unauthorized origin: ${event.origin}`);
            console.log('🔒 Allowed origins:', allowedOrigins);
            console.log('🔍 Origin check:', {
              eventOrigin: event.origin,
              clientUrl: process.env.CLIENT_URL,
              redirectOrigin,
              isClientMatch: event.origin === process.env.CLIENT_URL,
              isRedirectMatch: event.origin === redirectOrigin
            });
            return;
          }

          if (!event.data) {
            console.log('⚠️ Empty message received');
            return;
          }

          const { type, userData, error } = event.data;
          console.log('📝 Message type:', type);
          
          if (type === 'TIKTOK_AUTH_SUCCESS' && userData) {
            console.log('🎉 Auth successful!', userData);
            cleanup();
            resolve(userData);
          } else if (type === 'TIKTOK_AUTH_ERROR') {
            console.error('❌ Auth error:', error);
            cleanup();
            reject(new Error(error));
          }
        };

        const cleanup = () => {
          window.removeEventListener('message', handleMessage);
          if (popupCheckInterval) clearInterval(popupCheckInterval);
        };

        window.addEventListener('message', handleMessage);

        // Check if popup is closed
        popupCheckInterval = setInterval(() => {
          if (popup.closed) {
            console.log('⚠️ Popup closed by user');
            cleanup();
            reject(new Error('Authentication cancelled'));
          }
        }, 1000);

        // Timeout after 5 minutes
        setTimeout(() => {
          cleanup();
          reject(new Error('Authentication timed out'));
        }, 300000);
      });

      const popup = window.open(
        authUrl,
        'TikTok Login',
        `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=no, copyhistory=no, width=${width}, height=${height}, top=${top}, left=${left}`
      );

      if (!popup) {
        throw new Error('Popup blocked! Please allow popups for this site.');
      }

      const userData = await authPromise;
      
      set({ 
        user: userData, 
        isConnecting: false,
        accessToken: userData.access_token 
      });
      
      localStorage.setItem('tiktokUser', JSON.stringify(userData));
      toast.success('TikTok connected successfully!');
      window.location.reload();

    } catch (error) {
      console.error('❌ Connection error:', error);
      set({ error: error.message, isConnecting: false });
      toast.error('Failed to connect: ' + error.message);
    }
  },

  uploadVideo: async (file, description) => {
    const formData = new FormData();
    formData.append('video', file);
    formData.append('description', description);

    try {
      set({ isUploading: true });
      const response = await axios.post('/api/tiktok/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Video uploaded to TikTok successfully!');
      return response.data;
    } catch (error) {
      toast.error('Failed to upload video to TikTok');
      console.error('Upload error:', error.response?.data || error);
      throw error;
    } finally {
      set({ isUploading: false });
    }
  },
  setUser: (userData) => {
    console.log('Setting user data manually:', userData);
    set({ user: userData });
  },
  clearUser: () => set({ user: null })
})); 