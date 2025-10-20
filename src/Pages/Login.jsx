import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { RiFacebookCircleLine } from 'react-icons/ri';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  function validate() {
    if (!email) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Invalid email';
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setError(null);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/');
    }, 700);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 via-white to-blue-50 px-4 py-12">
      <div className="w-full max-w-3xl rounded-3xl bg-white shadow-xl ring-1 ring-blue-50 overflow-hidden grid md:grid-cols-2">
        {/* Left illustration / brand */}
        <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-white p-8 gap-6">
          <div className="w-40 h-40 rounded-full bg-blue-900/10 flex items-center justify-center">
            <img src="/Images/logo.png" alt="logo" className="w-28 h-28 object-contain" />
          </div>
          <h2 className="text-2xl font-extrabold text-blue-900">Welcome back</h2>
          <p className="text-sm text-blue-700/80 text-center px-6">Log in to continue exploring looks, try-on and save your favorites.</p>
        </div>

        {/* Right: form */}
        <div className="p-8 md:p-10">
          <h1 className="text-3xl font-extrabold text-blue-900 mb-6">Login</h1>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-blue-800 mb-2">Email</label>
              <div className="relative">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="you@domain.com"
                  className="w-full rounded-xl border border-blue-100 px-4 py-3 pl-12 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
                <Mail className="absolute left-3 top-3 h-6 w-6 text-blue-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-800 mb-2">Password</label>
              <div className="relative">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-blue-100 px-4 py-3 pl-12 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
                <Lock className="absolute left-3 top-3 h-6 w-6 text-blue-400" />
                <button type="button" onClick={() => setShowPassword(s => !s)} className="absolute right-3 top-2.5 text-sm text-blue-600">
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="inline-flex items-center gap-2 text-sm text-blue-800">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="h-4 w-4 rounded border-blue-200" />
                Remember me
              </label>
              <Link to="#" className="text-sm font-medium text-blue-900 hover:underline">Forgot password?</Link>
            </div>

            {error && <div className="text-sm text-red-600">{error}</div>}

            <div className="flex items-center gap-4">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full bg-blue-900 text-white px-6 py-2 font-semibold hover:bg-blue-800 disabled:opacity-60"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Log in'}
              </button>
              <Link to="/signup" className="text-sm font-medium text-blue-900 hover:underline ml-auto">Register</Link>
            </div>

            <div className="pt-4">
              <div className="relative text-center text-sm text-blue-400">or continue with</div>
              <div className="mt-3 flex flex-col gap-3">
                <button className="w-full rounded-lg border border-blue-100 bg-white px-4 py-3 text-sm text-blue-700 hover:bg-blue-50 flex items-center justify-center gap-3">
                  <FcGoogle className="text-3xl" />
                  <span className="font-medium">Continue with Google</span>
                </button>
                <button className="w-full rounded-lg border border-blue-100 bg-white px-4 py-3 text-sm text-blue-700 hover:bg-blue-50 flex items-center justify-center gap-3">
                  <RiFacebookCircleLine className="text-3xl text-blue-700" />
                  <span className="font-medium">Continue with Facebook</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
