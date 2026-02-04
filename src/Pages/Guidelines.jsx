import React from 'react';
import Footer from '../components/Footer/Footer';

const Guidelines = () => {
  return (
    <>
    <div className="min-h-screen bg-gray-50 flex justify-center px-4 py-12">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-2">
          Community Guidelines
        </h1>

        <p className="text-center text-gray-500 mb-10">
          Keeping Meraity.ai safe and respectful
        </p>

        <div className="space-y-6 text-gray-700 leading-relaxed">
          <div>
            <p className="mb-4">
              To keep Meraity.ai safe and respectful, the following is prohibited:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Nudity or explicit images</li>
              <li>Hate speech</li>
              <li>Harassment</li>
              <li>Illegal content</li>
            </ul>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Image Upload Responsibility
            </h2>
            <p>
              Users uploading images must ensure they have the right to use them.
            </p>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Consequences
            </h2>
            <p>
              Violations may result in account suspension or removal.
            </p>
          </div>
        </div>
      </div>
    </div>

    <Footer />
    </>
  );
};

export default Guidelines;
