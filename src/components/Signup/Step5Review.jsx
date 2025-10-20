import React from 'react'
import { Link } from 'react-router-dom'
import NavButtons from './NavButtons'

const Step3Review = ({ register, errors, watch, nextStep, prevStep, isFirstStep, isLastStep, onSubmit }) => {
  const formData = watch()

  const sections = [
    {
      title: 'Personal Information',
      fields: [
        { label: 'First Name', value: formData.firstName },
        { label: 'Middle Name', value: formData.middleName },
        { label: 'Last Name', value: formData.lastName },
        { label: 'Email', value: formData.email },
        { label: 'Phone', value: formData.phone },
        { label: 'Date of Birth', value: formData.dateOfBirth },
        { label: 'Gender', value: formData.gender },
        { label: 'Occupation', value: formData.occupation },
      ]
    },
    {
      title: 'Location',
      fields: [
        { label: 'Location', value: formData.location },
        { label: 'Country', value: formData.country },
        { label: 'State', value: formData.state },
        { label: 'City', value: formData.city },
        { label: 'Address', value: formData.address },
      ]
    },
    {
      title: 'Measurements',
      fields: [
        { label: 'Length', value: formData.length },
        { label: 'Chest', value: formData.chest },
        { label: 'Waist', value: formData.waist },
        { label: 'Hips', value: formData.hips },
      ]
    },
    {
      title: 'Planning',
      fields: [
        { label: 'Work From', value: formData.workFrom },
        { label: 'Work To', value: formData.workTo },
        { label: 'Gym From', value: formData.gymFrom },
        { label: 'Gym To', value: formData.gymTo },
        { label: 'Travel From', value: formData.travelFrom },
        { label: 'Travel To', value: formData.travelTo },
      ]
    },
    {
      title: 'Policy & Preferences',
      fields: [
        { label: 'Terms Accepted', value: formData.termsAccepted ? 'Yes' : 'No' },
        { label: 'Data Processing', value: formData.dataProcessing ? 'Yes' : 'No' },
        { label: 'Marketing Consent', value: formData.marketingConsent ? 'Yes' : 'No' },
        { label: 'Newsletter', value: formData.newsletter ? 'Yes' : 'No' },
      ]
    }
  ]

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-color-primary mb-4">Review Your Information</h2>
        <p className="text-gray-600">Please review your information before submitting</p>
      </div>

      {sections.map((section, sIdx) => (
        <div key={sIdx} className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">{section.title}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {section.fields.filter(f => f.value !== undefined && f.value !== '' ).map((field, idx) => (
              <div key={idx} className="flex flex-col">
                <span className="text-sm font-medium text-gray-500">{field.label}:</span>
                <span className="text-gray-800">{field.value}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Terms and Conditions agreement */}
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <input
            {...register('termsAccepted', { required: 'You must accept the terms and conditions' })}
            type="checkbox"
            id="termsAccepted"
            className="w-5 h-5 text-color-primary bg-gray-100 border-gray-300 rounded focus:ring-color-primary focus:ring-2 mt-1"
          />
          <label htmlFor="termsAccepted" className="text-sm text-gray-700">
            I agree to the <Link to="/terms" className="text-color-primary hover:underline">Terms and Conditions</Link> and <Link to="/privacy" className="text-color-primary hover:underline">Privacy Policy</Link>
          </label>
        </div>
        {errors.termsAccepted && (
          <p className="text-red-500 text-sm">{errors.termsAccepted.message}</p>
        )}

        <div className="flex items-start space-x-3">
          <input
            {...register('marketingConsent')}
            type="checkbox"
            id="marketingConsent"
            className="w-5 h-5 text-color-primary bg-gray-100 border-gray-300 rounded focus:ring-color-primary focus:ring-2 mt-1"
          />
          <label htmlFor="marketingConsent" className="text-sm text-gray-700">
            I agree to receive marketing emails and promotional offers
          </label>
        </div>
      </div>

      {/* Navigation Buttons */}
      <NavButtons prevStep={prevStep} showPrev={true} showSubmit={true} submitLabel="Complete Registration" />
    </form>
  )
}

export default Step3Review
