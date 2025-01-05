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
      
      if (!response.data.url) {
        throw new Error('Invalid auth URL response');
      }
      
      const authUrl = response.data.url;
      console.log('🔗 Opening popup with URL:', authUrl);
      
      const width = 600;
      const height = 600;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;

      // Define handleMessage before using it
      const handleMessage = (event) => {
        console.log('📨 Received message from popup:', event.data);
        
        if (!event.data || !event.data.type) {
          console.log('⚠️ Ignoring message - no type found');
          return;
        }
        
        // Ignore TikTok SDK messages
        if (event.data.type.startsWith('tea:sdk')) {
          console.log('⚠️ Ignoring TikTok SDK message');
          return;
        }
        
        const { type, userData, error } = event.data;
        if (type === 'TIKTOK_AUTH_SUCCESS' && userData) {
          console.log('🎉 Auth successful! User data:', userData);
          set({ 
            user: userData, 
            isConnecting: false,
            accessToken: userData.access_token 
          });
          
          // Store in localStorage
          console.log('💾 Storing user data in localStorage');
          localStorage.setItem('tiktokUser', JSON.stringify(userData));
          
          toast.success('TikTok connected successfully!');
          console.log('🔄 Refreshing page to update UI');
          window.location.reload();
        } else if (type === 'TIKTOK_AUTH_ERROR') {
          console.error('❌ Auth error:', error);
          set({ error: error, isConnecting: false });
          toast.error(error || 'Connection failed');
        }
        
        console.log('🧹 Cleaning up event listener');
        window.removeEventListener('message', handleMessage);
      };

      // Add event listener before opening popup
      console.log('👂 Adding message event listener');
      window.addEventListener('message', handleMessage);
      
      const popup = window.open(
        authUrl,
        'TikTok Login',
        `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${width}, height=${height}, top=${top}, left=${left}`
      );

      if (!popup) {
        console.error('❌ Popup was blocked!');
        throw new Error('Popup blocked! Please allow popups for this site.');
      }
      
      console.log('✅ Popup opened successfully');

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