import { Navigate, Route, Routes } from "react-router-dom";
import FloatingShape from "./components/FloatingShape";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import DashboardPage from "./pages/DashboardPage";
import SettingsPage from "./pages/SettingsPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import LoadingSpinner from "./components/LoadingSpinner";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import WelcomePage from "./pages/WelcomePage";

const ProtectedRoute = ({ children }) => {
	const { isAuthenticated } = useAuthStore();

	if (!isAuthenticated) {
		return <Navigate to='/login' replace />;
	}

	return children;
};

// redirect authenticated users to the dashboard
const RedirectAuthenticatedUser = ({ children }) => {
	const { isAuthenticated } = useAuthStore();

	if (isAuthenticated) {
		return <Navigate to='/dashboard' replace />;
	}

	return children;
};

function App() {
	return (
		<div className="min-h-screen bg-gray-900">
			<Routes>
				<Route path="/login" element={
					<RedirectAuthenticatedUser>
						<LoginPage />
					</RedirectAuthenticatedUser>
				} />
				<Route path="/signup" element={
					<RedirectAuthenticatedUser>
						<SignUpPage />
					</RedirectAuthenticatedUser>
				} />
				<Route path="/verify-email" element={<EmailVerificationPage />} />
				<Route path="/dashboard" element={
					<ProtectedRoute>
						<DashboardPage />
					</ProtectedRoute>
				} />
				<Route path="/settings" element={
					<ProtectedRoute>
						<SettingsPage />
					</ProtectedRoute>
				} />
				<Route path="/forgot-password" element={<ForgotPasswordPage />} />
				<Route path="/reset-password/:token" element={<ResetPasswordPage />} />
				<Route path="/terms" element={<TermsPage />} />
				<Route path="/privacy" element={<PrivacyPage />} />
				<Route path="/" element={<WelcomePage />} />
				<Route 
					path="/tiktokrjGuNvRAwESoGlUOI19JJ8xI27Ysc0lu.txt" 
					element={
						<pre style={{ whiteSpace: 'pre-wrap' }}>
							tiktok-developers-site-verification=rjGuNvRAwESoGlUOI19JJ8xI27Ysc0lu
						</pre>
					} 
				/>
			</Routes>
			<Toaster position="top-center" reverseOrder={false} />
		</div>
	);
}

export default App;
