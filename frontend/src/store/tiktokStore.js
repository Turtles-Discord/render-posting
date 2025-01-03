import { create } from 'zustand';
import axios from 'axios';
import toast from 'react-hot-toast';

export const useTiktokStore = create((set) => ({
  isConnecting: false,
  user: null,
  error: null,

  connectTiktok: async () => {
    try {
      console.log('Initiating TikTok connection');
      set({ isConnecting: true, error: null });
      
      const response = await axios.get('/api/tiktok/auth-url');
      console.log('Auth URL response:', response.data);
      
      if (!response.data.url) {
        throw new Error('Invalid auth URL response');
      }
      
      const authUrl = response.data.url;
      
      const width = 600;
      const height = 600;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;

      const popup = window.open(
        authUrl,
        'TikTok Login',
        `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${width}, height=${height}, top=${top}, left=${left}`
      );

      // Add message listener for popup callback
      const handleMessage = (event) => {
        console.log('Received message:', event.data);
        
        const { success, userData } = event.data;
        if (success && userData) {
          console.log('Setting user data:', userData);
          set({ user: userData });
          toast.success('TikTok account connected successfully!');
          window.removeEventListener('message', handleMessage);
        }
      };

      window.addEventListener('message', handleMessage);
    } catch (error) {
      console.error('TikTok connection error:', error);
      set({ error: error.message, isConnecting: false });
      toast.error('Failed to initiate TikTok connection');
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