import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import Navigation from '../components/Navigation/Navigation';
import PlatformSection from '../components/PlatformSection';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';
import VideoUploader from '../components/VideoUploader';
import { Link } from 'react-router-dom';
import { useTiktokStore } from '../store/tiktokStore';

const DashboardPage = () => {
	const { user } = useAuthStore();
	const [accounts, setAccounts] = useState({
			tiktok: [],
				instagram: []
	});
	const [videoFile, setVideoFile] = useState(null);
	const [description, setDescription] = useState('');
	const [isPosting, setIsPosting] = useState(false);
	const tiktokUser = useTiktokStore((state) => state.user);

	useEffect(() => {
		console.log('📊 Dashboard mounted');
		console.log('👤 TikTok user state:', tiktokUser);
	}, [tiktokUser]);

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

	const handleTiktokConnect = () => {
		console.log('🔗 TikTok connect button clicked');
		useTiktokStore.getState().connectTiktok();
	};

	const handlePost = async () => {
		if (!videoFile) {
			toast.error('Please select a video first');
			return;
		}

		setIsPosting(true);
		try {
			await uploadVideo(videoFile, description);
			setVideoFile(null);
			setDescription('');
			fetchAccounts();
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
					<div className="bg-gray-800 rounded-lg p-6">
						<div className="flex justify-between items-center">
							<h2 className="text-2xl font-bold text-green-400">TikTok Account</h2>
							{tiktokUser ? (
								<div className="flex items-center space-x-4">
									<span className="text-white">Connected as: {tiktokUser.display_name}</span>
									{tiktokUser.avatar_url && (
										<img src={tiktokUser.avatar_url} alt="Profile" className="w-8 h-8 rounded-full" />
									)}
								</div>
							) : (
								<button
									onClick={handleTiktokConnect}
									className="px-4 py-2 bg-[#ff0050] text-white rounded-lg hover:bg-[#d6004c] transition-colors"
								>
									Connect TikTok
								</button>
							)}
						</div>
					</div>

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
						description={description}
						onDescriptionChange={(e) => setDescription(e.target.value)}
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
