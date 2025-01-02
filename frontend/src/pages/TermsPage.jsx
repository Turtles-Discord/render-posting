import Navigation from '../components/Navigation/Navigation';

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-800 rounded-lg p-8">
          <h1 className="text-3xl font-bold text-green-400 mb-6">Terms of Service</h1>
          <div className="text-gray-300 space-y-6">
            <p className="text-sm text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
            
            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-green-400">1. Introduction</h2>
              <p>Welcome to PostMaster ("we," "our," or "us"). By accessing or using our website and services, you agree to these Terms of Service. Please read them carefully.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-green-400">2. Description of Service</h2>
              <p>PostMaster provides a platform for managing and publishing content to various social media platforms, including TikTok. Our service allows users to schedule, post, and manage their social media content through our web interface.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-green-400">3. Account Registration and Security</h2>
              <p>To use our services, you must:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Be at least 13 years old</li>
                <li>Register for an account with accurate information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Notify us immediately of any unauthorized access</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-green-400">4. User Content and Conduct</h2>
              <p>You retain ownership of your content but grant us necessary licenses to provide our services. You are responsible for:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Ensuring you have rights to share and distribute your content</li>
                <li>Complying with platform-specific guidelines (including TikTok's Community Guidelines)</li>
                <li>Not posting illegal, harmful, or prohibited content</li>
                <li>Respecting intellectual property rights</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-green-400">5. Platform Integration</h2>
              <p>Our service integrates with third-party platforms including TikTok. By using our service, you agree to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Comply with TikTok's Terms of Service</li>
                <li>Follow TikTok's Community Guidelines</li>
                <li>Adhere to TikTok's Developer Terms</li>
                <li>Accept platform-specific content restrictions</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-green-400">6. Privacy and Data Protection</h2>
              <p>We are committed to protecting your privacy and handling your data responsibly. Our practices comply with:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>General Data Protection Regulation (GDPR)</li>
                <li>California Consumer Privacy Act (CCPA)</li>
                <li>Platform-specific privacy requirements</li>
              </ul>
              <p>For details, please review our Privacy Policy.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-green-400">7. Service Modifications and Termination</h2>
              <p>We reserve the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Modify or discontinue services with notice</li>
                <li>Terminate accounts for violations</li>
                <li>Update these terms as needed</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-green-400">8. Limitation of Liability</h2>
              <p>Our service is provided "as is." We are not liable for:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Service interruptions or failures</li>
                <li>Data loss or security breaches</li>
                <li>Third-party platform changes</li>
                <li>Content removal by platforms</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-green-400">9. Intellectual Property</h2>
              <p>All service-related intellectual property, including but not limited to software, designs, and logos, belongs to PostMaster and is protected by copyright and trademark laws.</p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-green-400">10. Contact Information</h2>
              <p>For questions about these terms or our service:</p>
              <ul className="list-none space-y-2">
                <li>Email: buyyav20@gmail.com</li>
                <li>Website:https://render-posting.onrender.com/</li>
              </ul>
            </section>

            <section className="space-y-3 mt-8">
              <p className="text-sm text-gray-400">By using PostMaster, you acknowledge that you have read, understood, and agree to these Terms of Service.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage; 