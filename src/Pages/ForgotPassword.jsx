import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import { useAPI } from '../contexts/ApiContext';
import { useToast } from '../components/Toast/ToastContainer';

export default function ForgotPassword() {
  const api = useAPI();
  const { showSuccess, showError } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function validateEmail(email) {
    if (!email) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Invalid email address';
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationError = validateEmail(email);
    if (validationError) {
      showError(validationError);
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/forgot-password', { email });
      const message = res?.data?.message || res?.message || 'If an account with this email exists, you will receive a password reset link.';
      showSuccess(message);
      setSubmitted(true);
    } catch (err) {
      const errorMsg = err?.response?.data?.message || err?.message || 'Failed to send reset email. Please try again.';
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 via-white to-blue-50 px-4 py-12">
      <div className="w-full max-w-md rounded-3xl bg-white shadow-xl ring-1 ring-blue-50 overflow-hidden">
        <div className="p-8 md:p-10">
          <Link to="/login" className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 mb-6 font-medium">
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </Link>

          <h1 className="text-3xl font-extrabold text-blue-900 mb-2">Forgot Password?</h1>
          <p className="text-sm text-blue-700/80 mb-6">
            {submitted 
              ? "Check your email for a password reset link."
              : "Enter your email address and we'll send you a link to reset your password."}
          </p>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-blue-800 mb-2">Email Address</label>
                <div className="relative">
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-blue-100 px-4 py-3 pl-12 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    disabled={loading}
                  />
                  <Mail className="absolute left-3 top-3 h-6 w-6 text-blue-400" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-full bg-blue-900 text-white px-6 py-3 font-semibold hover:bg-blue-800 disabled:opacity-60 transition-colors"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>

              <div className="text-center text-sm text-blue-600">
                Remember your password?{' '}
                <Link to="/login" className="font-medium hover:underline">
                  Log in
                </Link>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="rounded-xl bg-blue-50 border border-blue-100 p-4 text-sm text-blue-800">
                <p className="font-medium mb-1">Email sent!</p>
                <p>We've sent a password reset link to <strong>{email}</strong>. Please check your inbox and spam folder.</p>
              </div>

              <div className="text-center text-sm text-blue-600">
                Didn't receive the email?{' '}
                <button 
                  onClick={() => setSubmitted(false)} 
                  className="font-medium hover:underline"
                >
                  Try again
                </button>
              </div>

              <Link 
                to="/login" 
                className="block w-full text-center rounded-full border-2 border-blue-900 text-blue-900 px-6 py-3 font-semibold hover:bg-blue-50 transition-colors"
              >
                Back to Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
