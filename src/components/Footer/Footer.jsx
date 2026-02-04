import React from 'react'
import { Link } from 'react-router-dom'
import { IoSparklesOutline } from 'react-icons/io5'
import { FaInstagram,FaTiktok } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-b border-blue-200 mt-12">
      {/* Top Section - App Downloads and Social Media */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Left Block - App Downloads */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
            <div className="text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                Meraity.ai App Soon
              </h2>

              {/* QR Code */}
              <div className="w-40 h-40 flex items-center justify-center mb-6 mx-auto md:mx-0 overflow-hidden bg-white">
                {typeof window !== 'undefined' ? (
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(window.location.origin)}&margin=0`}
                    alt="Meraity.ai QR"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200" />
                )}
              </div>
            </div>

            {/* App Store Buttons */}
            <div className="flex flex-col gap-4">
              <Link to="/download/app-store" className="inline-flex items-center bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors">
                <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <div className="text-left">
                  <div className="text-xs">Download on the</div>
                  <div className="text-lg font-semibold">App Store</div>
                </div>
              </Link>

              <Link to="/download/google-play" className="inline-flex items-center bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors">
                <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                </svg>
                <div className="text-left">
                  <div className="text-xs">GET IT ON</div>
                  <div className="text-lg font-semibold">Google Play</div>
                </div>
              </Link>
            </div>
          </div>

          {/* Right Block - Social Media */}
          <div className="flex flex-col items-center md:items-end">
            <p className="text-gray-700 mb-6 text-center md:text-right">
              You can also find us on
            </p>

            <div className="flex gap-4">
              <Link to="https://www.facebook.com/profile.php?id=61584675782092" className="w-12 h-12 bg-gray-900 text-white rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors" target="_blank" aria-label="Facebook">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </Link>

              <Link to="https://www.tiktok.com/@meraity.ai" className="w-12 h-12 bg-gray-900 text-white rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors" target="_blank" aria-label="TikTok">
                <FaTiktok color='white' />

              </Link>

              <Link to="https://www.instagram.com/meraity.ai" className="w-12 h-12 bg-gray-900 text-white rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors" target="_blank" aria-label="Instagram">
                <FaInstagram color="white" />
              </Link>
            </div>

            <div className="text-center md:text-right mt-4">
              <a href="mailto:info@meraity.ai" target="_blank" className="text-gray-700 text-lg block">info@meraity.ai</a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Legal Links */}
      <div className="border-t border-blue-200">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">

            <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm">
              <Link to="/imprint" className="text-gray-700 hover:text-color-primary transition-colors">Imprint</Link>
              <Link to="/terms" className="text-gray-700 hover:text-color-primary transition-colors">Terms & Conditions</Link>
              <Link to="/privacy" className="text-gray-700 hover:text-color-primary transition-colors">Privacy Preferences</Link>
              <Link to="/guidelines" className="text-gray-700 hover:text-color-primary transition-colors">Community Guidelines</Link>
              <Link to="/about" className="text-gray-700 hover:text-color-primary transition-colors">About Us</Link>
              <Link to="/contact" className="text-gray-700 hover:text-color-primary transition-colors">Contact</Link>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-700">
              <IoSparklesOutline className="w-5 h-5 text-blue-600" />
              <span>AI Powered</span>
            </div>

          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer;
