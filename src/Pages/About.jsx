import React from 'react';
import Footer from '../components/Footer/Footer';

const About = () => {
  return (
    <>
    <div className="min-h-screen bg-gray-50 flex justify-center px-4 py-12">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-2">
          About Us
        </h1>

        <p className="text-center text-gray-500 mb-10">
          AI-Powered Fashion Innovation
        </p>

        <div className="space-y-6 text-gray-700 leading-relaxed">
          <div>
            <p>
              Meraity.ai is an AI-powered fashion platform designed to help users try clothes
              before purchasing or wearing them.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Our Mission
            </h2>
            <p>
              Our mission is to combine artificial intelligence with fashion to create a
              smarter, more sustainable shopping experience.
            </p>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Keywords
            </h2>
            <p>
              AI fashion, virtual try-on, sustainable fashion, AI wardrobe management
            </p>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 text-right" dir="rtl">
              بالعربية
            </h3>
            <p className="text-right" dir="rtl">
              مرايتي هو تطبيق ذكي لتجربة الملابس افتراضياً قبل استخدامها أو شرائها.
            </p>
          </div>
        </div>
      </div>
    </div>

    <Footer />
    </>
  );
};

export default About;
