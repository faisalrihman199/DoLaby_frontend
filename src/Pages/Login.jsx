import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { RiFacebookCircleLine } from 'react-icons/ri';
import { useAPI } from '../contexts/ApiContext'
import { useAPP } from '../contexts/AppContext'

export default function Login() {
  const navigate = useNavigate();
  const api = useAPI()
  const [searchParams] = useSearchParams()
  const { login } = useAPP()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [autoLoading, setAutoLoading] = useState(false);
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
    try {
      const res = await api.post('/auth/login', { email, password });

      // ApiContext.post returns axios.response.data, which may have shape:
      // { success, message, data: { user, accessToken, refreshToken, ... } }
      // or { user, accessToken, refreshToken }
      const body = res?.data ?? res;

      const userFromBody = body?.user ?? body?.data?.user ?? null;
      const accessToken = body?.accessToken ?? body?.data?.accessToken ?? null;
      const refreshToken = body?.refreshToken ?? body?.data?.refreshToken ?? null;

      const tokens = accessToken ? { accessToken, refreshToken } : null;

      if (userFromBody && tokens) {
        login({ ...userFromBody, tokens });
      } else if (tokens) {
        // if only tokens returned
        login(tokens);
      } else if (userFromBody) {
        login(userFromBody);
      }

      // Persist tokens to localStorage (match Google flow) when present
      try {
        if (tokens) {
          if (tokens.accessToken) localStorage.setItem('accessToken', tokens.accessToken);
          if (tokens.refreshToken) localStorage.setItem('refreshToken', tokens.refreshToken);
        }
      } catch (e) { /* ignore storage errors */ }

      // Check if user is admin and redirect accordingly
      const userRole = userFromBody?.role || userFromBody?.user_type;
      if (userRole === 'admin') {
        navigate('/admin/dashboard', { replace: true });
        return;
      }

      // navigate to return path if provided, else home
      const returnTo = searchParams.get('next') || '/';
      navigate(returnTo, { replace: true });
    } catch (err) {
      console.error('Login failed', err);
      const serverMsg = err?.response?.data?.message || err?.response?.data?.error || err?.message || 'Login failed';
      setError(serverMsg);
    } finally {
      setLoading(false);
    }
  }

  // Auto-consume ?token= on the login page and sign the user in
  useEffect(() => {
    const token = searchParams.get('token')
    if (!token) return

    const finishAutoLogin = async () => {
      setAutoLoading(true);
      try {
        // store token in context/localStorage so ApiContext can use it
        login({ accessToken: token })

        // attempt to fetch full profile using the token
        try {
          const profileRes = await api.get('/auth/profile')
          const data = profileRes?.data || profileRes || null
          if (data) {
            // Extract user and tokens from common shapes
            const profileUser = data.user || data?.data?.user || (data.id ? data : null)
            const profileTokens = data.tokens || data?.data?.tokens || (data.accessToken ? { accessToken: data.accessToken, refreshToken: data.refreshToken } : null)

            if (profileUser && profileTokens) {
              const payload = { ...profileUser, tokens: profileTokens }
              login(payload)
              try {
                if (profileTokens.accessToken) localStorage.setItem('accessToken', profileTokens.accessToken)
                if (profileTokens.refreshToken) localStorage.setItem('refreshToken', profileTokens.refreshToken)
              } catch (e) { /* ignore */ }

              // Check if user is admin and redirect accordingly
              const userRole = profileUser?.role || profileUser?.user_type;
              if (userRole === 'admin') {
                try { navigate('/admin/dashboard', { replace: true }) } catch (e) { /* ignore */ }
                setAutoLoading(false);
                return;
              }
            } else if (profileTokens) {
              login(profileTokens)
              try { if (profileTokens.accessToken) localStorage.setItem('accessToken', profileTokens.accessToken) } catch (e) {}
            } else if (profileUser) {
              login(profileUser)

              // Check if user is admin and redirect accordingly
              const userRole = profileUser?.role || profileUser?.user_type;
              if (userRole === 'admin') {
                try { navigate('/admin/dashboard', { replace: true }) } catch (e) { /* ignore */ }
                setAutoLoading(false);
                return;
              }
            }
          }
        } catch (profileErr) {
          console.warn('Could not fetch profile after OAuth login:', profileErr)
          // proceed anyway — token is stored and user can retry fetching profile later
        }

        // replace URL to remove token from address bar and navigate home
        try { navigate('/', { replace: true }) } catch (e) { /* ignore */ }
      } catch (err) {
        console.error('Error during auto-login:', err)
      } finally {
        setAutoLoading(false);
      }
    }

    finishAutoLogin()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
                {autoLoading && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                    <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-blue-900"></div>
                  </div>
                )}
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
                  <span onClick={async () => {
                      try {
                        const res = await api.get('/oauth/google')
                        // try to extract access token from response
                        const maybeTokens = res?.tokens || res?.data?.tokens || res?.data?.data?.tokens || res?.accessToken || res?.data?.accessToken ? {
                          accessToken: res?.tokens?.accessToken || res?.data?.tokens?.accessToken || res?.data?.data?.tokens?.accessToken || res?.accessToken || res?.data?.accessToken,
                          refreshToken: res?.tokens?.refreshToken || res?.data?.tokens?.refreshToken || res?.data?.data?.tokens?.refreshToken || res?.refreshToken || res?.data?.refreshToken
                        } : null

                        if (maybeTokens && maybeTokens.accessToken) {
                          // navigate to login with token so login flow can consume it
                          navigate(`/login?token=${encodeURIComponent(maybeTokens.accessToken)}`)
                          return
                        }

                        // fallback: if backend returns a redirect URL / auth URL (common shape: { data: { authUrl } })
                        const authUrl = res?.authUrl || res?.data?.authUrl || res?.data?.data?.authUrl || res?.redirectUrl || res?.data?.redirectUrl || res?.data?.data?.redirectUrl || res?.url || null
                        if (authUrl) {
                          window.location.href = authUrl
                          return
                        }

                        // if nothing useful, show error (include server message if present)
                        const serverMsg = res?.message || res?.data?.message || null
                        setError(serverMsg || 'Could not start Google OAuth flow.')
                      } catch (err) {
                        console.error(err)
                        setError(err?.response?.data?.message || err.message || 'OAuth request failed')
                      }
                    }} className="w-full cursor-pointer rounded-lg border border-blue-100 bg-white px-4 py-3 text-sm text-blue-700 hover:bg-blue-50 flex items-center justify-center gap-3">
                    <FcGoogle className="text-3xl" />
                    <span className="font-medium">Continue with Google</span>
                  </span>
                  <span onClick={async () => {
                      try {
                        const res = await api.get('/oauth/facebook')
                        const maybeTokens = res?.tokens || res?.data?.tokens || res?.data?.data?.tokens || res?.accessToken || res?.data?.accessToken ? {
                          accessToken: res?.tokens?.accessToken || res?.data?.tokens?.accessToken || res?.data?.data?.tokens?.accessToken || res?.accessToken || res?.data?.accessToken,
                          refreshToken: res?.tokens?.refreshToken || res?.data?.tokens?.refreshToken || res?.data?.data?.tokens?.refreshToken || res?.refreshToken || res?.data?.refreshToken
                        } : null

                        if (maybeTokens && maybeTokens.accessToken) {
                          navigate(`/login?token=${encodeURIComponent(maybeTokens.accessToken)}`)
                          return
                        }

                        const authUrl = res?.authUrl || res?.data?.authUrl || res?.data?.data?.authUrl || res?.redirectUrl || res?.data?.redirectUrl || res?.data?.data?.redirectUrl || res?.url || null
                        if (authUrl) {
                          window.location.href = authUrl
                          return
                        }

                        const serverMsg = res?.message || res?.data?.message || null
                        setError(serverMsg || 'Could not start Facebook OAuth flow.')
                      } catch (err) {
                        console.error(err)
                        setError(err?.response?.data?.message || err.message || 'OAuth request failed')
                      }
                    }} className="w-full cursor-pointer rounded-lg border border-blue-100 bg-white px-4 py-3 text-sm text-blue-700 hover:bg-blue-50 flex items-center justify-center gap-3">
                    <RiFacebookCircleLine className="text-3xl text-blue-700" />
                    <span className="font-medium">Continue with Facebook</span>
                  </span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
