import React from 'react'

export default function NavButtons({
  prevStep,
  showPrev = true,
  showSubmit = true,
  showCancel = false,
  cancelHandler,
  submitLabel = 'Next'
}) {
  return (
    <div className="flex justify-center space-x-4 pt-8">
      {showPrev && (
        <button
          type="button"
          onClick={prevStep}
          className="px-8 py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
        >
          Previous
        </button>
      )}

      {showSubmit && (
        <button
          type="submit"
          className="px-8 py-3 bg-[color:var(--text-color-primary)] text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
        >
          {submitLabel}
        </button>
      )}

      {showCancel && (
        <button
          type="button"
          onClick={cancelHandler}
          className="px-8 py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
        >
          Cancel
        </button>
      )}
    </div>
  )
}
