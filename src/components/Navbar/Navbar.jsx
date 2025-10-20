import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { PiUserCircleLight } from 'react-icons/pi';
import { IoIosHeartEmpty } from 'react-icons/io';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loggedIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isRegisterPage = location.pathname === '/signup';

  return (
    <>
      {/* Desktop */}
      <nav className="hidden md:flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-cursive text-color-primary font-bold" style={{ fontFamily: 'Kaushan Script' }}>
            Dolaby
          </h1>
          <div className="h-10 w-10">
            <img src="/Images/logo.png" alt="Dolaby Logo" />
          </div>
        </div>

        <div className="flex items-center space-x-8">
          <Link to="/" className="text-color-primary font-semibold hover:opacity-90 transition-colors">
            Home
          </Link>
          <Link to="/wardrobe" className="text-color-primary font-semibold hover:opacity-90 transition-colors">
            Wardrobe
          </Link>
          <Link to="/favorites" className="text-color-primary font-semibold hover:opacity-90 transition-colors">
            Favorites
          </Link>

          {loggedIn ? (
            <div className="flex items-center space-x-4 ml-4">
              <PiUserCircleLight className="cursor-pointer" size={28} />
              <IoIosHeartEmpty className="cursor-pointer" size={28} />
            </div>
          ) : isRegisterPage ? (
            <button
              type="button"
              className="text-color-primary font-semibold hover:opacity-90 transition-colors"
              onClick={() => navigate('/login')}
            >
              Login
            </button>
          ) : (
            <Link to="/signup" className="text-color-primary font-semibold hover:opacity-90 transition-colors">
              Register
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile */}
      <nav className="md:hidden flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-cursive text-color-primary font-bold" style={{ fontFamily: 'Kaushan Script' }}>
            Dolaby
          </h1>
          <div className="h-10 w-10">
            <img src="/Images/logo.png" alt="Dolaby Logo" />
          </div>
        </div>

        <button
          aria-label="Toggle menu"
          className="text-color-primary"
          onClick={() => setIsMobileMenuOpen((s) => !s)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>

      {/* Mobile sidebar */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-999 bg-black/20" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="fixed top-0 right-0 h-full w-80 bg-blue-100 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-[#035477]">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-cursive text-color-primary font-bold" style={{ fontFamily: 'Kaushan Script' }}>
                  Dolaby
                </h1>
                <div className="h-10 w-10">
                  <img src="/Images/logo.png" alt="Dolaby Logo" />
                </div>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} aria-label="Close menu">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                <Link to="/" className="block text-lg text-color-primary font-semibold hover:opacity-90 transition-colors py-2" onClick={() => setIsMobileMenuOpen(false)}>
                  Home
                </Link>
                <Link to="/wardrobe" className="block text-lg text-color-primary font-semibold hover:opacity-90 transition-colors py-2" onClick={() => setIsMobileMenuOpen(false)}>
                  Wardrobe
                </Link>
                <Link to="/favorites" className="block text-lg text-color-primary font-semibold hover:opacity-90 transition-colors py-2" onClick={() => setIsMobileMenuOpen(false)}>
                  Favorites
                </Link>

                {loggedIn ? (
                  <div className="flex items-center space-x-6 pt-6 border-t border-[#035477]">
                    <div className="flex items-center space-x-2">
                      <svg className="w-6 h-6 text-color-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="text-color-primary font-medium">Profile</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <svg className="w-6 h-6 text-color-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span className="text-color-primary font-medium">Favorites</span>
                    </div>
                  </div>
                ) : isRegisterPage ? (
                  <button className="block text-lg text-color-primary font-semibold hover:opacity-90 transition-colors pt-6 border-t border-[#035477] w-full text-left" onClick={() => { setIsMobileMenuOpen(false); navigate('/login'); }}>
                    Login
                  </button>
                ) : (
                  <Link to="/signup" className="block text-lg text-color-primary font-semibold hover:opacity-90 transition-colors pt-6 border-t border-[#035477]" onClick={() => setIsMobileMenuOpen(false)}>
                    Register
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}