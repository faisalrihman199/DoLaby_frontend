import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { useAPI } from '../contexts/ApiContext'

const VerifyEmail = () => {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const api = useAPI()
  const navigate = useNavigate()
  const [status, setStatus] = useState('loading') // loading | success | error
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('No verification token provided.')
      return
    }

    const verify = async () => {
      try {
        const res = await api.post('/auth/verify-email', { token })

        // Try to detect tokens in response and redirect to login with token if present
        const maybeTokens = res?.tokens || res?.data?.tokens || res?.data?.data?.tokens || res?.accessToken || res?.data?.accessToken ? {
          accessToken: res?.tokens?.accessToken || res?.data?.tokens?.accessToken || res?.data?.data?.tokens?.accessToken || res?.accessToken || res?.data?.accessToken,
          refreshToken: res?.tokens?.refreshToken || res?.data?.tokens?.refreshToken || res?.data?.data?.tokens?.refreshToken || res?.refreshToken || res?.data?.refreshToken
        } : null

        if (maybeTokens && maybeTokens.accessToken) {
          // Redirect to login with token so frontend login can consume it
          navigate(`/login?token=${encodeURIComponent(maybeTokens.accessToken)}`)
          return
        }

        const msg = res?.message || res?.data?.message || 'Your email has been verified successfully.'
        setStatus('success')
        setMessage(msg)
      } catch (err) {
        const msg = err?.response?.data?.message || err.message || 'Verification failed.'
        setStatus('error')
        setMessage(msg)
      }
    }

    verify()
  }, [token, api, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-lg w-full">
        <div className="bg-white p-8 rounded shadow">
          {status === 'loading' && (
            <div className="text-center">
              <p className="mb-4">Verifying your email...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Email verified</h2>
              <p className="text-sm text-gray-600 mb-4">{message}</p>
              <div className="flex gap-2 justify-center">
                <Link to="/login" className="px-4 py-2 bg-color-primary text-white rounded">Go to Login</Link>
                <Link to="/" className="px-4 py-2 border rounded">Home</Link>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Verification failed</h2>
              <p className="text-sm text-red-600 mb-4">{message}</p>
              <div className="flex gap-2 justify-center">
                <Link to="/signup" className="px-4 py-2 bg-color-primary text-white rounded">Sign up</Link>
                <Link to="/login" className="px-4 py-2 border rounded">Login</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default VerifyEmail
