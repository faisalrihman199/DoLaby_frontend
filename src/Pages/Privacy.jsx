import React from 'react';
import Footer from '../components/Footer/Footer';

const Privacy = () => {
  return (
    <>
    <div className="min-h-screen bg-gray-50 flex justify-center px-4 py-12">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-2">
          Privacy Policy
        </h1>

        <p className="text-center text-gray-500 mb-10">
          Your privacy is important to us
        </p>

        <div className="space-y-6 text-gray-700 leading-relaxed">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Data Collection
            </h2>
            <p className="mb-2">Meraity.ai collects and processes the following data:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Name and email address</li>
              <li>Cookies</li>
              <li>Analytics data</li>
              <li>Body measurements (if provided by the user)</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Purpose of Data Collection
            </h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Account functionality</li>
              <li>Improving AI services</li>
              <li>Analytics and performance optimization</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Third-Party Services
            </h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>AI APIs</li>
              <li>Social media login providers</li>
              <li>Analytics tools</li>
            </ul>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <p className="font-medium">
              We do not sell personal data.
            </p>
            <p className="mt-2">
              Users can request data deletion by contacting:{" "}
              <a
                href="mailto:info@meraity.ai"
                className="text-blue-600 hover:underline"
              >
                info@meraity.ai
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>

    <Footer />
    </>
  );
};

export default Privacy;
