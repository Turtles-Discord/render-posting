import { create } from 'zustand';
import axios from 'axios';
import toast from 'react-hot-toast';

export const useTiktokStore = create((set) => ({
  isConnecting: false,
  user: null,
  error: null,

  connectTiktok: async () => {
    try {
      const response = await axios.get('/api/tiktok/auth-url');
      const authUrl = response.data.url;
      
      // Open popup window
      const width = 600;
      const height = 600;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;

      window.open(
        authUrl,
        'TikTok Login',
        `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${width}, height=${height}, top=${top}, left=${left}`
      );

      // Add message listener for popup callback
      window.addEventListener('message', (event) => {
        if (event.origin === window.location.origin) {
          const { success, userData } = event.data;
          if (success && userData) {
            set({ user: userData });
            toast.success('TikTok account connected successfully!');
          }
        }
      });
    } catch (error) {
      toast.error('Failed to initiate TikTok connection');
      console.error('TikTok connection error:', error);
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
  setUser: (userData) => set({ user: userData }),
  clearUser: () => set({ user: null })
})); 