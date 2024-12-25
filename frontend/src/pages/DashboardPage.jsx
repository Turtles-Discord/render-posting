import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import Navigation from '../components/Navigation/Navigation';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';

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
			const response = await axios.get('/api/auth/accounts');
			setAccounts(response.data.accounts);
		} catch (error) {
			toast.error('Failed to fetch accounts');
		}
	};

	const handlePost = async () => {
		if (!videoFile) {
			toast.error('Please select a video first');
			return;
		}

		setIsPosting(true);
		const formData = new FormData();
		formData.append('video', videoFile);
		formData.append('description', description);

		try {
			await axios.post('/api/post/video', formData);
			toast.success('Video posted successfully');
			setVideoFile(null);
			setDescription('');
		} catch (error) {
			toast.error('Failed to post video');
		} finally {
			setIsPosting(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-900">
			<Navigation />
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="grid grid-cols-1 lg:grid-cols-3 gap-8"
				>
					{/* Platform Sections */}
					<div className="lg:col-span-2 space-y-8">
						{/* TikTok Accounts */}
						<div className="bg-gray-800 rounded-lg p-6">
							<h2 className="text-2xl font-bold text-green-400 mb-4">TikTok Accounts</h2>
							{/* Add TikTok accounts list */}
						</div>

						{/* Instagram Accounts */}
						<div className="bg-gray-800 rounded-lg p-6">
							<h2 className="text-2xl font-bold text-green-400 mb-4">Instagram Accounts</h2>
							{/* Add Instagram accounts list */}
						</div>
					</div>

					{/* Upload Section */}
					<div className="bg-gray-800 rounded-lg p-6">
						<h2 className="text-2xl font-bold text-green-400 mb-4">Upload Video</h2>
						{/* Add video upload form */}
					</div>
				</motion.div>
			</div>
		</div>
	);
};

export default DashboardPage;
