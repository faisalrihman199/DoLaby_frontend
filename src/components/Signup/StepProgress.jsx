import React from 'react'

const StepProgress = ({ currentStep, totalSteps }) => {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1)

  return (
    <div className="mt-8 px-4">
      {/* Mobile Progress - Compact horizontal layout */}
      <div className="md:hidden">
        <div className="flex justify-between items-center space-x-2">
          {steps.map((step, index) => (
            <div key={step} className="flex flex-col items-center flex-1">
              {/* Step Circle */}
              <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors mb-2 ${
                step <= currentStep
                  ? 'bg-[color:var(--text-color-primary)] border-[color:var(--text-color-primary)] text-white'
                  : 'bg-white border-gray-300 text-gray-400'
              }`}>
                {step < currentStep ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <span className="text-xs font-semibold">{step}</span>
                )}
              </div>
              
              {/* Step Label */}
              <span className={`text-xs font-medium transition-colors text-center ${
                step <= currentStep ? 'text-[color:var(--text-color-primary)]' : 'text-gray-400'
              }`}>
                {step === 1 && 'Register'}
                {step === 2 && 'Measure'}
                {step === 3 && 'Plan'}
                {step === 4 && 'Policy'}
                {step === 5 && 'Review'}
                {step === 6 && 'Profile'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Progress - Full layout with connectors */}
      <div className="hidden md:block">
        <div className="flex justify-center items-center space-x-2 lg:space-x-4">
          {steps.map((step, index) => (
            <div key={step} className="flex items-center">
              {/* Step Circle */}
              <div className={`flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 rounded-full border-2 transition-colors ${
                step <= currentStep
                  ? 'bg-[color:var(--text-color-primary)] border-[color:var(--text-color-primary)] text-white'
                  : 'bg-white border-gray-300 text-gray-400'
              }`}>
                {step < currentStep ? (
                  <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <span className="text-sm font-semibold">{step}</span>
                )}
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className={`w-8 lg:w-12 h-0.5 transition-colors ${
                  step < currentStep ? 'bg-[color:var(--text-color-primary)]' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Labels */}
        <div className="flex justify-center items-center space-x-2 lg:space-x-4 mt-4">
          {steps.map((step) => (
            <div key={step} className="flex flex-col items-center">
               <span className={`text-xs lg:text-sm font-medium transition-colors ${
                 step <= currentStep ? 'text-[color:var(--text-color-primary)]' : 'text-gray-400'
               }`}>
                 {step === 1 && 'Register'}
                 {step === 2 && 'Measurement'}
                 {step === 3 && 'Planning'}
                 {step === 4 && 'Policy'}
                 {step === 5 && 'Review'}
                 {step === 6 && 'Profile'}
               </span>
            </div>
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-[color:var(--text-color-primary)] h-2 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}

export default StepProgress
