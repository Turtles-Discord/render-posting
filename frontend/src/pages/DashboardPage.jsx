import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import Navigation from '../components/Navigation/Navigation';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';
import PlatformSection from '../components/PlatformSection';

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
				<div className="space-y-8">
					<PlatformSection 
						platform="tiktok"
						accounts={accounts.tiktok}
						onAccountsUpdate={fetchAccounts}
					/>
					<PlatformSection 
						platform="instagram"
						accounts={accounts.instagram}
						onAccountsUpdate={fetchAccounts}
					/>
					
					{/* Video upload section remains the same */}
				</div>
			</div>
		</div>
	);
};

export default DashboardPage;
