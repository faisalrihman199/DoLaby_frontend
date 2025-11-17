import React from 'react'
import NavButtons from './NavButtons'
import { useNavigate } from 'react-router-dom'

const Step7Profile = ({ 
  register, 
  errors, 
  watch, 
  nextStep, 
  prevStep, 
  isFirstStep, 
  isLastStep, 
  onSubmit,
  onComplete,
  isCompleting,
  completionError
}) => {
  const formData = watch()
  const navigate = useNavigate()

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      
      <div className="text-center mb-8">
        <p className="text-gray-600">Your account has been created successfully!</p>
      </div>

      {/* Show error if profile completion failed */}
      {completionError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center max-w-md mx-auto">
          <p className="font-medium">Profile Setup Error</p>
          <p className="text-sm mt-1">{completionError}</p>
        </div>
      )}

      {/* Show loading state during profile fetch */}
      {isCompleting && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-center max-w-md mx-auto">
          <p className="font-medium">Completing your profile...</p>
          <p className="text-sm mt-1">Please wait while we fetch your information.</p>
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white rounded-lg p-8  max-w-md mx-auto">
        
        {/* User Avatar */}
        <div className="flex flex-col items-center space-y-4">
          <div className="w-24 h-24 bg-gray-100 rounded-full border-4 border-gray-800 flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>

          {/* Star Rating */}
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-6 h-6 ${star === 1 ? 'text-yellow-400' : 'text-gray-300'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>

          {/* User Information */}
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {formData.firstName} {formData.lastName}
            </h3>
            <p className="text-green-600 font-medium mb-1">
              Congratulations your account created successfully
            </p>
            <p className="text-sm text-gray-500">
              You still have no points.
            </p>
          </div>
        </div>

        {/* Separator */}
        <div className="border-t border-gray-200 my-6"></div>

        {/* Wardrobe Button */}
        <div className="text-center">
          <button
            type="button"
            className="w-full bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => {
              // Call onComplete to fetch profile and clear signup data
              if (onComplete) {
                onComplete()
              } else {
                // Fallback to simple navigation
                navigate('/wardrobe')
              }
            }}
            disabled={isCompleting}
          >
            {isCompleting ? 'Loading...' : 'Wardrobe'}
          </button>
        </div>
      </div>

      {/* Additional Information */}
      <div className="bg-white rounded-lg p-6 shadow-sm  max-w-2xl mx-auto">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Name:</span>
              <span className="font-medium">{formData.firstName} {formData.middleName} {formData.lastName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium">{formData.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Phone:</span>
              <span className="font-medium">{formData.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Location:</span>
              <span className="font-medium">{formData.city}, {formData.country}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">User Type:</span>
              <span className="font-medium">{formData.userType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Account Status:</span>
              <span className="font-medium text-green-600">Active</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Member Since:</span>
              <span className="font-medium">{new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Points:</span>
              <span className="font-medium">0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons - hidden on final profile step */}
      {!isLastStep && (
        <NavButtons prevStep={prevStep} showPrev={true} showSubmit={true} showCancel={true} cancelHandler={() => {}} submitLabel="Complete Setup" />
      )}
    </form>
  )
}

export default Step7Profile
