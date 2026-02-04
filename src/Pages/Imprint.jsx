import React from "react";
import Footer from '../components/Footer/Footer';

const Imprint = () => {
  return (
    <>
    <div className="min-h-screen bg-gray-50 flex justify-center px-4 py-12">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-2">
          Imprint
        </h1>

        <p className="text-center text-gray-500 mb-10">
          Legal Disclosure
        </p>

        <div className="space-y-6 text-gray-700 leading-relaxed">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Meraity.ai
            </h2>
            <p>AI-Powered Fashion Platform</p>
          </div>

          <div>
            <p>
              <span className="font-medium">Location:</span> Cairo, Egypt
            </p>
            <p>
              <span className="font-medium">Email:</span>{" "}
              <a
                href="mailto:info@meraity.ai"
                className="text-blue-600 hover:underline"
              >
                info@meraity.ai
              </a>
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Responsible for content according to applicable laws
            </h3>
            <p>Haitham M. E. Mostafa</p>
          </div>

          <div>
            <p>
              <span className="font-medium">VAT ID:</span> Not available
            </p>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <p>
              Meraity.ai provides an AI-powered fashion experience including
              virtual try-on and wardrobe management services.
            </p>
          </div>
        </div>
      </div>
    </div>

    <Footer />
    </>
  );
};

export default Imprint;
