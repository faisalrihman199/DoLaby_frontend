import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer/Footer';
import { IoSparklesOutline } from 'react-icons/io5';

const ComingSoon = () => {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl text-center">
          {/* Icon */}
          <div className="mb-8 flex justify-center">
            <div className="relative">a
              <div className="absolute inset-0 bg-blue-400 rounded-full blur-2xl opacity-30"></div>
              <IoSparklesOutline className="w-24 h-24 text-blue-600 relative" />
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Coming Soon
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
            We're working hard to bring the Meraity.ai mobile app to your fingertips. Stay tuned!
          </p>

          {/* Description */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <p className="text-gray-700 mb-6">
              Download the Meraity.ai app to enjoy an enhanced experience with virtual try-on and AI-powered wardrobe management on the go.
            </p>
            <p className="text-gray-600 text-sm">
              App Store and Google Play versions coming very soon
            </p>
          </div>

          {/* Email Notification Form */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 max-w-md mx-auto">
            <p className="text-gray-700 font-medium mb-4">
              Get notified when we launch
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors font-medium">
                Notify
              </button>
            </div>
          </div>

          {/* Back to Home Link */}
          <Link
            to="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-colors font-medium"
          >
            Back to Home
          </Link>

          {/* Decorative Elements */}
          <div className="mt-16 grid grid-cols-3 gap-4 max-w-md mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">📱</div>
              <p className="text-sm text-gray-600 mt-2">iPhone App</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">🤖</div>
              <p className="text-sm text-gray-600 mt-2">AI Powered</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">👗</div>
              <p className="text-sm text-gray-600 mt-2">Try-On Tech</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ComingSoon;
