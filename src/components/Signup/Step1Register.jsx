import React from 'react'

const Step1Register = ({ register, errors, watch, nextStep, prevStep, isFirstStep, handleSubmit, onStep1Submit, isLoading, error }) => {

  return (
    <form onSubmit={handleSubmit ? handleSubmit(onStep1Submit) : ((e) => { e.preventDefault(); nextStep() })} className="space-y-8">

      {/* Server error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded">
          {error}
        </div>
      )}
      
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

          {/* Middle Name (mobile-only) */}
          <div className="block md:hidden">
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
                minLength: { value: 8, message: 'Password must be at least 8 characters long' },
                pattern: { value: /[A-Za-z]/, message: 'Password must contain at least one letter' }
              })}
              type="password"
              className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Enter your password (min 8 chars, include a letter)"
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

          {/* Location Field removed per request */}

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
          {/* Middle Name Field (desktop-only) */}
          <div className="hidden md:block">
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

          {/* Email Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email:
            </label>
            <input
              {...register('email', { required: 'Email is required' })}
              type="email"
              className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Postal Code Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Postal Code:
            </label>
            <input
              {...register('postalCode')}
              type="text"
              className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Enter your postal code"
            />
            {errors.postalCode && (
              <p className="text-red-500 text-sm mt-1">{errors.postalCode.message}</p>
            )}
          </div>

          {/* User Type Selection */}
          {/* <div className="flex items-center space-x-4 pt-8">
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
          </div> */}
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

        {/* Primary Next: submit the form (validate + potentially send to backend) */}
        <button
          type="submit"
          disabled={isLoading}
          className={`px-8 py-3 rounded-lg font-semibold transition-colors ${isLoading ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'}`}
        >
          {isLoading ? 'Processing...' : 'Next'}
        </button>
      </div>
    </form>
  )
}

export default Step1Register
