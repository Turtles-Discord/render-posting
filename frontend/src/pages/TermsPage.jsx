import Navigation from '../components/Navigation/Navigation';

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-800 rounded-lg p-8">
          <h1 className="text-3xl font-bold text-green-400 mb-6">Terms of Service</h1>
          <div className="text-gray-300 space-y-4">
            <p className="text-sm text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
            
            <section className="space-y-2">
              <h2 className="text-xl font-semibold text-green-400">1. Acceptance of Terms</h2>
              <p>By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.</p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-semibold text-green-400">2. Use License</h2>
              <p>Permission is granted to temporarily download one copy of the materials (information or software) on Social Media Poster's website for personal, non-commercial transitory viewing only.</p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-semibold text-green-400">3. Disclaimer</h2>
              <p>The materials on Social Media Poster's website are provided on an 'as is' basis. Social Media Poster makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-semibold text-green-400">4. Limitations</h2>
              <p>In no event shall Social Media Poster or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Social Media Poster's website.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage; 