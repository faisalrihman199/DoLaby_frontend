import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useAPI } from '../contexts/ApiContext';
import { useToast } from '../components/Toast/ToastContainer';

export default function ResetPassword() {
  const navigate = useNavigate();
  const api = useAPI();
  const { showSuccess, showError } = useToast();
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (!tokenParam) {
      showError('Invalid or missing reset token');
      setTimeout(() => navigate('/forgot-password'), 2000);
    } else {
      setToken(tokenParam);
    }
  }, [searchParams, navigate, showError]);

  function validatePassword(password) {
    const errors = [];
    if (!password) {
      return ['Password is required'];
    }
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    return errors;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // Validate passwords
    const passwordErrors = validatePassword(newPassword);
    if (passwordErrors.length > 0) {
      showError(passwordErrors.join('. '));
      return;
    }

    if (newPassword !== confirmPassword) {
      showError('Passwords do not match');
      return;
    }

    if (!token) {
      showError('Invalid reset token');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/reset-password', {
        token,
        newPassword
      });
      const message = res?.data?.message || res?.message || 'Password reset successfully';
      showSuccess(message);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      const errorData = err?.response?.data;
      
      // Handle validation errors array
      if (errorData?.errors && Array.isArray(errorData.errors)) {
        showError(errorData.errors.join('. '));
      } else {
        const errorMsg = errorData?.message || err?.message || 'Failed to reset password. Please try again.';
        showError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  }

  // Password strength indicator
  const passwordStrength = () => {
    const errors = validatePassword(newPassword);
    if (!newPassword) return { text: '', color: '' };
    if (errors.length === 0) return { text: 'Strong', color: 'text-green-600' };
    if (errors.length <= 2) return { text: 'Medium', color: 'text-yellow-600' };
    return { text: 'Weak', color: 'text-red-600' };
  };

  const strength = passwordStrength();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 via-white to-blue-50 px-4 py-12">
      <div className="w-full max-w-md rounded-3xl bg-white shadow-xl ring-1 ring-blue-50 overflow-hidden">
        <div className="p-8 md:p-10">
          {!success ? (
            <>
              <h1 className="text-3xl font-extrabold text-blue-900 mb-2">Reset Password</h1>
              <p className="text-sm text-blue-700/80 mb-6">
                Create a new secure password for your account.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-blue-800 mb-2">New Password</label>
                  <div className="relative">
                    <input
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter new password"
                      className="w-full rounded-xl border border-blue-100 px-4 py-3 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      disabled={loading}
                    />
                    <Lock className="absolute left-3 top-3 h-6 w-6 text-blue-400" />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-blue-600 hover:text-blue-700"
                    >
                      {showPassword ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
                    </button>
                  </div>
                  {newPassword && (
                    <p className={`text-sm mt-1 font-medium ${strength.color}`}>
                      Password strength: {strength.text}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-800 mb-2">Confirm Password</label>
                  <div className="relative">
                    <input
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="Confirm new password"
                      className="w-full rounded-xl border border-blue-100 px-4 py-3 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      disabled={loading}
                    />
                    <Lock className="absolute left-3 top-3 h-6 w-6 text-blue-400" />
                    <button 
                      type="button" 
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-3 text-blue-600 hover:text-blue-700"
                    >
                      {showConfirm ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
                    </button>
                  </div>
                </div>

                <div className="rounded-xl bg-blue-50 border border-blue-100 p-4 text-xs text-blue-800 space-y-1">
                  <p className="font-semibold mb-2">Password requirements:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>At least 8 characters long</li>
                    <li>Contains at least one uppercase letter</li>
                    <li>Contains at least one number</li>
                  </ul>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-full bg-blue-900 text-white px-6 py-3 font-semibold hover:bg-blue-800 disabled:opacity-60 transition-colors"
                  disabled={loading || !token}
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>

                <div className="text-center text-sm text-blue-600">
                  <Link to="/login" className="font-medium hover:underline">
                    Back to Login
                  </Link>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-blue-900">Password Reset Successful!</h2>
              <p className="text-sm text-blue-700/80">
                Your password has been reset successfully. Redirecting to login...
              </p>
              <Link 
                to="/login" 
                className="inline-block rounded-full bg-blue-900 text-white px-6 py-3 font-semibold hover:bg-blue-800 transition-colors"
              >
                Go to Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
