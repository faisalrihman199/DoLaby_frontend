import React from 'react'

const Step6Policy = ({ register, errors, watch, nextStep, prevStep, isFirstStep, isLastStep }) => {
  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      nextStep()
    }} className="space-y-8">
      
      <div className="text-center mb-8">
        <p className="text-gray-600">Please review our terms and policies</p>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-lg p-8 shadow-sm border min-h-96">
        
        {/* Policy Content */}
        <div className="space-y-6 text-gray-700">
          <div className="prose max-w-none">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Terms of Service</h3>
            <p className="mb-4">
              Welcome to Dolaby! By using our service, you agree to be bound by these Terms of Service. 
              Please read them carefully before using our platform.
            </p>
            
            <h4 className="text-md font-semibold text-gray-800 mb-2">1. User Responsibilities</h4>
            <p className="mb-4">
              As a user of Dolaby, you are responsible for maintaining the confidentiality of your account 
              and password. You agree to accept responsibility for all activities that occur under your account.
            </p>
            
            <h4 className="text-md font-semibold text-gray-800 mb-2">2. Content Guidelines</h4>
            <p className="mb-4">
              You agree not to upload, post, or transmit any content that is unlawful, harmful, threatening, 
              abusive, or otherwise objectionable. We reserve the right to remove any content that violates these guidelines.
            </p>
            
            <h4 className="text-md font-semibold text-gray-800 mb-2">3. Privacy Policy</h4>
            <p className="mb-4">
              Your privacy is important to us. We collect and use your personal information in accordance with 
              our Privacy Policy. By using our service, you consent to the collection and use of information as described.
            </p>
            
            <h4 className="text-md font-semibold text-gray-800 mb-2">4. Service Availability</h4>
            <p className="mb-4">
              While we strive to provide continuous service, we do not guarantee that our platform will be 
              available at all times. We may experience downtime for maintenance, updates, or other reasons.
            </p>
            
            <h4 className="text-md font-semibold text-gray-800 mb-2">5. Limitation of Liability</h4>
            <p className="mb-4">
              Dolaby shall not be liable for any indirect, incidental, special, or consequential damages 
              resulting from the use or inability to use our service.
            </p>
          </div>
        </div>

        {/* Agreement Checkboxes */}
        <div className="mt-8 space-y-4 border-t pt-6">
          <div className="flex items-start space-x-3">
            <input
              {...register('termsAccepted', { required: 'You must accept the terms of service' })}
              type="checkbox"
              id="termsAccepted"
              className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 mt-1"
            />
            <label htmlFor="termsAccepted" className="text-sm text-gray-700">
              I have read and agree to the <strong>Terms of Service</strong> and <strong>Privacy Policy</strong>
            </label>
          </div>
          {errors.termsAccepted && (
            <p className="text-red-500 text-sm">{errors.termsAccepted.message}</p>
          )}

          <div className="flex items-start space-x-3">
            <input
              {...register('dataProcessing', { required: 'You must consent to data processing' })}
              type="checkbox"
              id="dataProcessing"
              className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 mt-1"
            />
            <label htmlFor="dataProcessing" className="text-sm text-gray-700">
              I consent to the processing of my personal data for the purposes described in the Privacy Policy
            </label>
          </div>
          {errors.dataProcessing && (
            <p className="text-red-500 text-sm">{errors.dataProcessing.message}</p>
          )}

          <div className="flex items-start space-x-3">
            <input
              {...register('marketingConsent')}
              type="checkbox"
              id="marketingConsent"
              className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 mt-1"
            />
            <label htmlFor="marketingConsent" className="text-sm text-gray-700">
              I agree to receive marketing communications and promotional offers via email and SMS (optional)
            </label>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-center space-x-4 pt-8">
        <button
          type="button"
          onClick={prevStep}
          className="px-8 py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
        >
          Back
        </button>
        <button
          type="submit"
          className="px-8 py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
        >
          Next
        </button>
        <button
          type="button"
          onClick={() => {/* Handle cancel */}}
          className="px-8 py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

export default Step6Policy
