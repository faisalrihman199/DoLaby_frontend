import React from 'react'

const Step1Register = ({ register, errors, watch, nextStep, prevStep, isFirstStep, isLastStep }) => {
  const userType = watch('userType')

  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      nextStep()
    }} className="space-y-8">
      
      {/* Personal Information Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Name:
            </label>
            <input
              {...register('firstName', { required: 'Name is required' })}
              type="text"
              className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Enter your first name"
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
            )}
          </div>

          {/* Last Name Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Last Name:
            </label>
            <input
              {...register('lastName', { required: 'Last name is required' })}
              type="text"
              className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Enter your last name"
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password:
            </label>
            <input
              {...register('password', { 
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' }
              })}
              type="password"
              className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Match Password Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Match Password:
            </label>
            <input
              {...register('confirmPassword', { 
                required: 'Please confirm your password',
                validate: (value) => value === watch('password') || 'Passwords do not match'
              })}
              type="password"
              className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Location Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Location:
            </label>
            <input
              {...register('location', { required: 'Location is required' })}
              type="text"
              className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Enter your location"
            />
            {errors.location && (
              <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
            )}
          </div>

          {/* Country Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Country:
            </label>
            <input
              {...register('country', { required: 'Country is required' })}
              type="text"
              className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Enter your country"
            />
            {errors.country && (
              <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>
            )}
          </div>

          {/* State Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              State:
            </label>
            <input
              {...register('state', { required: 'State is required' })}
              type="text"
              className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Enter your state"
            />
            {errors.state && (
              <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>
            )}
          </div>

          {/* City Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              City:
            </label>
            <input
              {...register('city', { required: 'City is required' })}
              type="text"
              className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Enter your city"
            />
            {errors.city && (
              <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
            )}
          </div>

          {/* Address Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Address:
            </label>
            <input
              {...register('address', { required: 'Address is required' })}
              type="text"
              className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Enter your address"
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Middle Name Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              M Name:
            </label>
            <input
              {...register('middleName')}
              type="text"
              className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Enter your middle name"
            />
            {errors.middleName && (
              <p className="text-red-500 text-sm mt-1">{errors.middleName.message}</p>
            )}
          </div>

          {/* User Type Selection */}
          <div className="flex items-center space-x-4 pt-8">
            <label className="text-sm font-semibold text-gray-700">
              Are you
            </label>
            <div className="flex items-center space-x-2">
              <input
                {...register('userType')}
                type="checkbox"
                id="userType"
                className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <label htmlFor="userType" className="text-sm font-semibold text-gray-700">
                User
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-center space-x-4 pt-8">
        <button
          type="button"
          onClick={prevStep}
          disabled={isFirstStep}
          className={`px-8 py-3 rounded-lg font-semibold transition-colors ${
            isFirstStep 
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
              : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
          }`}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-8 py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
        >
          Next
        </button>
      </div>
    </form>
  )
}

export default Step1Register
