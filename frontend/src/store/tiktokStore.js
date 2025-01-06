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
      
      const width = 600;
      const height = 800;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;

      // Create a promise to handle the popup response
      const authPromise = new Promise((resolve, reject) => {
        const handleMessage = (event) => {
          console.log('📨 Raw message received:', event);
          
          // Verify origin
          if (event.origin !== process.env.CLIENT_URL) {
            console.log('⚠️ Ignoring message from unknown origin:', event.origin);
            return;
          }

          if (!event.data) {
            console.log('⚠️ No data in message');
            return;
          }

          console.log('📨 Processing message:', event.data);
          
          const { type, userData, error } = event.data;
          
          if (type === 'TIKTOK_AUTH_SUCCESS' && userData) {
            console.log('🎉 Auth successful! User data:', userData);
            window.removeEventListener('message', handleMessage);
            resolve(userData);
          } else if (type === 'TIKTOK_AUTH_ERROR') {
            console.error('❌ Auth error:', error);
            window.removeEventListener('message', handleMessage);
            reject(new Error(error));
          }
        };

        window.addEventListener('message', handleMessage);
      });

      const popup = window.open(
        authUrl,
        'TikTok Login',
        `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=no, copyhistory=no, width=${width}, height=${height}, top=${top}, left=${left}`
      );

      if (!popup) {
        throw new Error('Popup blocked! Please allow popups for this site.');
      }

      // Wait for the auth promise to resolve
      const userData = await authPromise;
      
      // Update store with user data
      set({ 
        user: userData, 
        isConnecting: false,
        accessToken: userData.access_token 
      });
      
      // Store in localStorage
      localStorage.setItem('tiktokUser', JSON.stringify(userData));
      
      toast.success('TikTok connected successfully!');
      
      // Force a UI refresh
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