import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer/Footer';

const NotFound = () => {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl text-center">
          {/* Large 404 */}
          <div className="mb-8">
            <h1 className="text-9xl md:text-[120px] font-bold text-blue-200 leading-none">
              404
            </h1>
          </div>

          {/* Heading */}
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h2>

          {/* Description */}
          <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
            Oops! The page you're looking for doesn't exist or has been moved. Let's get you back on track.
          </p>

          {/* Content Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <p className="text-gray-700 mb-6">
              The URL you entered might be incorrect, or the page may have been removed.
            </p>
            <p className="text-gray-600">
              Don't worry, you can always return to the home page or explore other sections of Meraity.ai
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              to="/"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-colors font-medium"
            >
              Go to Home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-900 px-8 py-3 rounded-lg transition-colors font-medium"
            >
              Go Back
            </button>
          </div>

          {/* Quick Links */}
          <div className="bg-blue-50 rounded-2xl p-6 max-w-md mx-auto">
            <p className="text-gray-700 font-semibold mb-4">Quick Navigation</p>
            <div className="grid grid-cols-2 gap-3">
              <Link to="/wardrobe" className="text-blue-600 hover:underline">
                Wardrobe
              </Link>
              <Link to="/favorites" className="text-blue-600 hover:underline">
                Favorites
              </Link>
              <Link to="/contact" className="text-blue-600 hover:underline">
                Contact Us
              </Link>
              <Link to="/about" className="text-blue-600 hover:underline">
                About Us
              </Link>
            </div>
          </div>

          {/* Support Message */}
          <div className="mt-12 text-sm text-gray-600">
            <p>
              Need help? <a href="mailto:info@meraity.ai" className="text-blue-600 hover:underline">Contact our support team</a>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default NotFound;
