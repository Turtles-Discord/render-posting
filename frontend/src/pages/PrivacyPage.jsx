import Navigation from '../components/Navigation/Navigation';

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-800 rounded-lg p-8">
          <h1 className="text-3xl font-bold text-green-400 mb-6">Privacy Policy</h1>
          <div className="text-gray-300 space-y-4">
            <p className="text-sm text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
            
            <section className="space-y-2">
              <h2 className="text-xl font-semibold text-green-400">1. Information We Collect</h2>
              <p>We collect information that you provide directly to us, including when you create an account, connect social media accounts, or contact us for support.</p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-semibold text-green-400">2. How We Use Your Information</h2>
              <p>We use the information we collect to provide, maintain, and improve our services, to develop new ones, and to protect our platform and our users.</p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-semibold text-green-400">3. Information Sharing</h2>
              <p>We do not share your personal information with companies, organizations, or individuals outside of Social Media Poster except in the following cases: with your consent, for legal reasons, or as part of a business transfer.</p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-semibold text-green-400">4. Data Security</h2>
              <p>We work hard to protect our users from unauthorized access to or unauthorized alteration, disclosure, or destruction of information we hold.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage; 