import { create } from 'zustand';
import axios from 'axios';
import toast from 'react-hot-toast';

export const useTiktokStore = create((set) => ({
  isConnecting: false,
  accounts: [],
  error: null,

  connectTiktok: async () => {
    try {
      const response = await axios.get('/api/tiktok/auth-url');
      window.location.href = response.data.url;
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
  }
})); 