import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import Navigation from '../components/Navigation/Navigation';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const SettingsPage = () => {
  const { user, updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: user.email || '',
    name: user.name || ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put('/api/auth/update-profile', formData);
      updateUser(response.data.user);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-lg p-6"
        >
          <h1 className="text-3xl font-bold text-green-400 mb-8">Account Settings</h1>
          
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div>
                <h2 className="text-sm font-medium text-gray-400">Email</h2>
                <p className="mt-1 text-lg text-white">{user.email}</p>
              </div>
              <div>
                <h2 className="text-sm font-medium text-gray-400">Name</h2>
                <p className="mt-1 text-lg text-white">{user.name}</p>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Edit Profile
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default SettingsPage; 