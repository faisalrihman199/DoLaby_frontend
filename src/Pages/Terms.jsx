import React from 'react';
import Footer from '../components/Footer/Footer';

const Terms = () => {
  return (
    <>
    <div className="min-h-screen bg-gray-50 flex justify-center px-4 py-12">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-2">
          Terms & Conditions
        </h1>

        <p className="text-center text-gray-500 mb-10">
          Welcome to Meraity.ai
        </p>

        <div className="space-y-6 text-gray-700 leading-relaxed">
          <div>
            <p>
              Meraity.ai is an AI-powered fashion platform that allows users to try clothes
              virtually and manage their wardrobe using artificial intelligence.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              By using this platform, you agree to the following:
            </h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>You use the service at your own responsibility.</li>
              <li>All AI-generated results are for visualization purposes only.</li>
              <li>Accounts may be suspended or removed in case of misuse.</li>
              <li>Uploaded content must not violate laws or platform rules.</li>
              <li>We reserve the right to update these terms at any time.</li>
            </ul>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 text-right" dir="rtl">
              الوصف بالعربية
            </h3>
            <p className="text-right" dir="rtl">
              تطبيق مرايتي لتجربة الملابس قبل استخدامها باستخدام الذكاء الاصطناعي.
            </p>
          </div>
        </div>
      </div>
    </div>

    <Footer />
    </>
  );
};

export default Terms;
