import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, Save, Camera } from 'lucide-react';
import { useAPI } from '../contexts/ApiContext';
import { useAPP } from '../contexts/AppContext';
import { useToast } from '../components/Toast/ToastContainer';

export default function UserProfile() {
  const navigate = useNavigate();
  const api = useAPI();
  const { user, login } = useAPP();
  const { showSuccess, showError } = useToast();

  // Profile data
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);

  // Password change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Fetch user profile on mount
  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    setProfileLoading(true);
    try {
      const res = await api.get('/users/profile');
      const userData = res?.data?.user || res?.user || res?.data?.data?.user || res;
      
      setFirstName(userData.first_name || '');
      setMiddleName(userData.middle_name || '');
      setLastName(userData.last_name || '');
      setEmail(userData.email || '');
      setAvatarUrl(userData.avatar_url || '');
      setRole(userData.role || 'user');
    } catch (err) {
      const errorMsg = err?.response?.data?.message || err?.message || 'Failed to load profile';
      showError(errorMsg);
      if (err?.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setProfileLoading(false);
    }
  }

  async function handleUpdateProfile(e) {
    e.preventDefault();

    if (!firstName || !lastName) {
      showError('First name and last name are required');
      return;
    }

    setLoading(true);
    try {
      const res = await api.put('/users', {
        first_name: firstName,
        middle_name: middleName,
        last_name: lastName,
        avatar_url: avatarUrl
      });

      const updatedUser = res?.data?.user || res?.user || res?.data?.data?.user;
      
      // Update context with new user data
      if (updatedUser) {
        login({ ...user, ...updatedUser });
      }

      showSuccess('Profile updated successfully');
    } catch (err) {
      const errorData = err?.response?.data;
      if (errorData?.errors && Array.isArray(errorData.errors)) {
        showError(errorData.errors.join('. '));
      } else {
        const errorMsg = errorData?.message || err?.message || 'Failed to update profile';
        showError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleChangePassword(e) {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      showError('All password fields are required');
      return;
    }

    if (newPassword !== confirmPassword) {
      showError('New passwords do not match');
      return;
    }

    // Validate new password strength
    const passwordErrors = validatePassword(newPassword);
    if (passwordErrors.length > 0) {
      showError(passwordErrors.join('. '));
      return;
    }

    setPasswordLoading(true);
    try {
      await api.put('/users', {
        currentPassword,
        newPassword
      });

      showSuccess('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      const errorData = err?.response?.data;
      if (errorData?.errors && Array.isArray(errorData.errors)) {
        showError(errorData.errors.join('. '));
      } else {
        const errorMsg = errorData?.message || err?.message || 'Failed to change password';
        showError(errorMsg);
      }
    } finally {
      setPasswordLoading(false);
    }
  }

  function validatePassword(password) {
    const errors = [];
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

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 via-white to-blue-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-xl ring-1 ring-blue-50 p-8">
          <h1 className="text-3xl font-extrabold text-blue-900 mb-2">My Profile</h1>
          <p className="text-sm text-blue-700/80">Manage your account settings and preferences</p>
        </div>

        {/* Profile Information */}
        <div className="bg-white rounded-3xl shadow-xl ring-1 ring-blue-50 p-8">
          <h2 className="text-2xl font-bold text-blue-900 mb-6">Profile Information</h2>
          
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-6">
              <div className="relative">
                {avatarUrl ? (
                  <img 
                    src={avatarUrl} 
                    alt="Profile" 
                    className="w-24 h-24 rounded-full object-cover border-4 border-blue-100"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center border-4 border-blue-200">
                    <User className="w-12 h-12 text-blue-600" />
                  </div>
                )}
                <button 
                  type="button"
                  className="absolute bottom-0 right-0 bg-blue-900 text-white p-2 rounded-full hover:bg-blue-800 transition-colors"
                  onClick={() => {
                    const url = prompt('Enter avatar URL:', avatarUrl);
                    if (url !== null) setAvatarUrl(url);
                  }}
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-900">{firstName} {lastName}</h3>
                <p className="text-sm text-blue-600">{email}</p>
                <p className="text-xs text-blue-500 capitalize mt-1">{role}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-blue-800 mb-2">First Name *</label>
                <div className="relative">
                  <input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    type="text"
                    placeholder="John"
                    className="w-full rounded-xl border border-blue-100 px-4 py-3 pl-12 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    disabled={loading}
                  />
                  <User className="absolute left-3 top-3 h-6 w-6 text-blue-400" />
                </div>
              </div>

              {/* Middle Name */}
              <div>
                <label className="block text-sm font-medium text-blue-800 mb-2">Middle Name</label>
                <div className="relative">
                  <input
                    value={middleName}
                    onChange={(e) => setMiddleName(e.target.value)}
                    type="text"
                    placeholder="Michael"
                    className="w-full rounded-xl border border-blue-100 px-4 py-3 pl-12 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    disabled={loading}
                  />
                  <User className="absolute left-3 top-3 h-6 w-6 text-blue-400" />
                </div>
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-blue-800 mb-2">Last Name *</label>
                <div className="relative">
                  <input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    type="text"
                    placeholder="Doe"
                    className="w-full rounded-xl border border-blue-100 px-4 py-3 pl-12 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    disabled={loading}
                  />
                  <User className="absolute left-3 top-3 h-6 w-6 text-blue-400" />
                </div>
              </div>

              {/* Email (readonly) */}
              <div>
                <label className="block text-sm font-medium text-blue-800 mb-2">Email</label>
                <div className="relative">
                  <input
                    value={email}
                    type="email"
                    className="w-full rounded-xl border border-blue-100 px-4 py-3 pl-12 bg-gray-50 cursor-not-allowed"
                    disabled
                  />
                  <Mail className="absolute left-3 top-3 h-6 w-6 text-blue-400" />
                </div>
                <p className="text-xs text-blue-600 mt-1">Email cannot be changed</p>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full bg-blue-900 text-white px-6 py-3 font-semibold hover:bg-blue-800 disabled:opacity-60 transition-colors"
                disabled={loading}
              >
                <Save className="w-5 h-5" />
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-3xl shadow-xl ring-1 ring-blue-50 p-8">
          <h2 className="text-2xl font-bold text-blue-900 mb-6">Change Password</h2>
          
          <form onSubmit={handleChangePassword} className="space-y-5">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium text-blue-800 mb-2">Current Password</label>
              <div className="relative">
                <input
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  type={showCurrent ? 'text' : 'password'}
                  placeholder="Enter current password"
                  className="w-full rounded-xl border border-blue-100 px-4 py-3 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  disabled={passwordLoading}
                />
                <Lock className="absolute left-3 top-3 h-6 w-6 text-blue-400" />
                <button 
                  type="button" 
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-3 text-blue-600 hover:text-blue-700"
                >
                  {showCurrent ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-blue-800 mb-2">New Password</label>
              <div className="relative">
                <input
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  type={showNew ? 'text' : 'password'}
                  placeholder="Enter new password"
                  className="w-full rounded-xl border border-blue-100 px-4 py-3 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  disabled={passwordLoading}
                />
                <Lock className="absolute left-3 top-3 h-6 w-6 text-blue-400" />
                <button 
                  type="button" 
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-3 text-blue-600 hover:text-blue-700"
                >
                  {showNew ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-blue-800 mb-2">Confirm New Password</label>
              <div className="relative">
                <input
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  className="w-full rounded-xl border border-blue-100 px-4 py-3 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  disabled={passwordLoading}
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

            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full bg-blue-900 text-white px-6 py-3 font-semibold hover:bg-blue-800 disabled:opacity-60 transition-colors"
                disabled={passwordLoading}
              >
                <Lock className="w-5 h-5" />
                {passwordLoading ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
