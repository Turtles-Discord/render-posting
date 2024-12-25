import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import Navigation from '../components/Navigation/Navigation';
import PlatformSection from '../components/PlatformSection';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';
import VideoUploader from '../components/VideoUploader';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
	const { user } = useAuthStore();
	const [accounts, setAccounts] = useState({
			tiktok: [],
				instagram: []
	});
	const [videoFile, setVideoFile] = useState(null);
	const [description, setDescription] = useState('');
	const [isPosting, setIsPosting] = useState(false);

	useEffect(() => {
		fetchAccounts();
	}, []);

	const fetchAccounts = async () => {
		try {
			setAccounts({
				tiktok: [],
				instagram: []
			});
		} catch (error) {
			toast.error('Failed to fetch accounts');
			setAccounts({
				tiktok: [],
				instagram: []
			});
		}
	};

	const handleFileSelect = (file) => {
		setVideoFile(file);
	};

	const handlePost = async (file, description) => {
		if (!file) {
			toast.error('Please select a video first');
			return;
		}

		setIsPosting(true);
		const formData = new FormData();
		formData.append('video', file);
		formData.append('description', description);

		try {
			await axios.post('/api/post/video', formData, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			});
			
			toast.success('Video posted successfully');
			setVideoFile(null);
			setDescription('');
			fetchAccounts(); // Refresh account status
		} catch (error) {
			toast.error('Failed to post video: ' + error.message);
		} finally {
			setIsPosting(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-900">
			<Navigation />
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="space-y-8">
					<PlatformSection 
						platform="tiktok"
						accounts={accounts.tiktok || []}
						onAccountsUpdate={fetchAccounts}
					/>
					<PlatformSection 
						platform="instagram"
						accounts={accounts.instagram || []}
						onAccountsUpdate={fetchAccounts}
					/>
					
					<VideoUploader 
						onFileSelect={handleFileSelect}
						onPost={handlePost}
						isPosting={isPosting}
					/>

					{/* Footer Links */}
					<div className="pt-8 border-t border-gray-800">
						<div className="flex justify-center space-x-4 text-sm text-gray-400">
							<Link to="/terms" className="hover:text-green-400 transition-colors">
								Terms of Service
							</Link>
							<span>•</span>
							<Link to="/privacy" className="hover:text-green-400 transition-colors">
								Privacy Policy
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DashboardPage;
