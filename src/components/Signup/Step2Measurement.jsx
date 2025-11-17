import React, { useRef, useState } from 'react'
import { UploadCloud, XCircle } from 'lucide-react';

const Step2Measurement = ({ register, errors, watch, nextStep, prevStep, _isFirstStep, _isLastStep, handleSubmit, onStep2Submit, isLoading, error, existingImage }) => {
  const [photo, setPhoto] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const inputRef = useRef();
  const handlePhotoChange = (e) => {
    // Support both input change events and drop events
    const file = (e.target && e.target.files && e.target.files[0]) || (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]);
    if (file) {
      // Store the actual File object for upload
      setPhotoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => setPhoto(reader.result);
      reader.readAsDataURL(file);
    }
  };
  const submitHandler = (formData) => {
    const payload = {}
    
    // Only include non-empty measurement values
    if (formData.length) payload.length = String(formData.length)
    if (formData.chest) payload.chest = String(formData.chest)
    if (formData.waist) payload.waist = String(formData.waist)
    if (formData.hips) payload.hips = String(formData.hips)
    
    // Only include image if user has selected a new file
    // (don't re-send existingImage on subsequent submissions)
    if (photoFile) {
      payload.image = photoFile
    }
    
    if (onStep2Submit) {
      onStep2Submit(payload)
    } else {
      nextStep()
    }
  }

  return (
    <form
      onSubmit={handleSubmit ? handleSubmit(submitHandler) : (e) => { e.preventDefault(); submitHandler({ length: watch('length'), chest: watch('chest'), waist: watch('waist'), hips: watch('hips') }) }}
      className="space-y-8"
    >
      {/* Show existing image (from server) when no new photo selected */}
      {!photo && existingImage && (
        <div className="mb-4 flex items-center justify-center">
          <img src={existingImage} alt="Measurement" className="max-h-64 object-contain rounded" />
        </div>
      )}
      {/* Server error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded">
          {error}
        </div>
      )}

      <div className="text-center mb-8">
        <p className="text-gray-600">Please provide your body measurements for a better fit</p>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Left Section - Visual Aid */}
        <div className="flex justify-center lg:justify-start">
          <div className="relative">
            {/* Human Silhouette */}
            <img src="/Images/Signup/measurement.png" alt="Measurement Body" />
          </div>
        </div>

        {/* Right Section - Input Fields */}
        <div className="space-y-6">
          {/* Length Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Length:
            </label>
            <input
              {...register('length', {
                required: 'Length is required',
                min: { value: 0, message: 'Length must be positive' }
              })}
              type="number"
              step="0.1"
              className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Enter length in cm"
            />
            {errors.length && (
              <p className="text-red-500 text-sm mt-1">{errors.length.message}</p>
            )}
          </div>

          {/* Chest Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Chest:
            </label>
            <input
              {...register('chest', {
                required: 'Chest measurement is required',
                min: { value: 0, message: 'Chest measurement must be positive' }
              })}
              type="number"
              step="0.1"
              className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Enter chest measurement in cm"
            />
            {errors.chest && (
              <p className="text-red-500 text-sm mt-1">{errors.chest.message}</p>
            )}
          </div>

          {/* Waist Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Waist:
            </label>
            <input
              {...register('waist', {
                required: 'Waist measurement is required',
                min: { value: 0, message: 'Waist measurement must be positive' }
              })}
              type="number"
              step="0.1"
              className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Enter waist measurement in cm"
            />
            {errors.waist && (
              <p className="text-red-500 text-sm mt-1">{errors.waist.message}</p>
            )}
          </div>

          {/* Hips Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Hips:
            </label>
            <input
              {...register('hips', {
                required: 'Hips measurement is required',
                min: { value: 0, message: 'Hips measurement must be positive' }
              })}
              type="number"
              step="0.1"
              className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Enter hips measurement in cm"
            />
            {errors.hips && (
              <p className="text-red-500 text-sm mt-1">{errors.hips.message}</p>
            )}
          </div>
          <div className="flex flex-col justify-center">
            <label className="block text-base font-semibold text-gray-700 mb-3">Upload your Photo</label>
            <div
              className="relative  h-80 bg-white rounded-2xl shadow ring-1 ring-blue-100 flex flex-col items-center justify-center border-2 border-dashed border-blue-200 hover:border-blue-400 transition-all cursor-pointer group"
              onClick={() => inputRef.current?.click()}
              onDragOver={e => e.preventDefault()}
              onDrop={e => { e.preventDefault(); handlePhotoChange(e); }}
            >
              {!photo ? (
                <>
                  <UploadCloud className="w-14 h-14 text-blue-400 mb-2" />
                  <div className="text-blue-700 font-medium mb-1">Drag & drop or click to upload</div>
                  <div className="text-xs text-blue-400">PNG, JPG, JPEG up to 5MB</div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center relative">
                  <img src={photo} alt="Uploaded" className="object-contain w-full h-full rounded-2xl" />
                  <button
                    type="button"
                    className="absolute top-2 right-2 bg-white/80 rounded-full p-1 shadow hover:bg-red-100"
                    onClick={e => { e.stopPropagation(); setPhoto(null); setPhotoFile(null); }}
                    tabIndex={-1}
                  >
                    <XCircle className="w-7 h-7 text-red-500" />
                  </button>
                </div>
              )}
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ...existing code for measurement fields... */}
      {/* Upload Photo Section (moved below fields) */}
      <div className="mt-8">

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
          disabled={isLoading}
          className={`px-8 py-3 rounded-lg font-semibold transition-colors ${isLoading ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'}`}
        >
          {isLoading ? 'Processing...' : 'Next'}
        </button>
        <button
          type="button"
          onClick={() => {/* Handle cancel */ }}
          className="px-8 py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

export default Step2Measurement
