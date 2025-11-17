import React, { useState } from 'react'

const Step3Planning = ({ register, errors, watch, nextStep, prevStep, handleSubmit, onStep3Submit, isLoading, error }) => {
  // Restrict travel date-times to the current month
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0)
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 0)

  const toDateTimeLocal = (date) => {
    const pad = (n) => String(n).padStart(2, '0')
    const yyyy = date.getFullYear()
    const mm = pad(date.getMonth() + 1)
    const dd = pad(date.getDate())
    const hh = pad(date.getHours())
    const min = pad(date.getMinutes())
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`
  }

  const travelMin = toDateTimeLocal(monthStart)
  const travelMax = toDateTimeLocal(monthEnd)
  const [selectedDays, setSelectedDays] = useState({
    work: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    gym: ['Sunday', 'Monday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  })

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  const handleDayToggle = (section, day) => {
    setSelectedDays(prev => ({
      ...prev,
      [section]: prev[section].includes(day)
        ? prev[section].filter(d => d !== day)
        : [...prev[section], day]
    }))
  }

  const generateCalendar = () => {
    const year = now.getFullYear()
    const month = now.getMonth() // Current month (0-indexed)
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    
    const calendar = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      calendar.push(null)
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      calendar.push(day)
    }
    
    return calendar
  }

  const calendarDays = generateCalendar()
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December']
  const currentMonthName = monthNames[now.getMonth()]

  const submitHandler = (formData) => {
    if (onStep3Submit) {
      onStep3Submit(formData, selectedDays)
    } else {
      nextStep()
    }
  }

  return (
    <form onSubmit={handleSubmit ? handleSubmit(submitHandler) : (e) => { e.preventDefault(); submitHandler({ workFrom: watch('workFrom'), workTo: watch('workTo'), gymFrom: watch('gymFrom'), gymTo: watch('gymTo'), travelFrom: watch('travelFrom'), travelTo: watch('travelTo') }) }} className="space-y-8">
      
      {/* Server error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded">
          {error}
        </div>
      )}

      <div className="text-center mb-8">
        <p className="text-gray-600">Set up your schedule preferences</p>
      </div>

      {/* Calendar Section */}
      <div className=" rounded-lg p-6  ">
        <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">{currentMonthName} {now.getFullYear()}</h3>
        
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => (
            <div 
              key={index}
              className={`aspect-square flex items-center justify-center text-sm border border-gray-200 rounded ${
                day 
                  ? 'bg-blue-50 text-gray-700 hover:bg-blue-100 cursor-pointer' 
                  : 'bg-transparent'
              }`}
            >
              {day}
            </div>
          ))}
        </div>
      </div>

      {/* Work Time Section */}
      <div className="rounded-lg p-6 m ">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Work time</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Time Input */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                From:
              </label>
              <input
                {...register('workFrom', { required: 'Work start time is required' })}
                type="time"
                className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
              {errors.workFrom && (
                <p className="text-red-500 text-sm mt-1">{errors.workFrom.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                To:
              </label>
              <input
                {...register('workTo', { required: 'Work end time is required' })}
                type="time"
                className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
              {errors.workTo && (
                <p className="text-red-500 text-sm mt-1">{errors.workTo.message}</p>
              )}
            </div>
          </div>

          {/* Days Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Days:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {days.map(day => (
                <label key={day} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedDays.work.includes(day)}
                    onChange={() => handleDayToggle('work', day)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-sm text-gray-700">{day}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* GYM Time Section */}
      <div className=" rounded-lg p-6 ">
        <h3 className="text-lg font-bold text-gray-800 mb-4">GYM Time</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Time Input */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                From:
              </label>
              <input
                {...register('gymFrom', { required: 'Gym start time is required' })}
                type="time"
                className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
              {errors.gymFrom && (
                <p className="text-red-500 text-sm mt-1">{errors.gymFrom.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                To:
              </label>
              <input
                {...register('gymTo', { required: 'Gym end time is required' })}
                type="time"
                className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
              {errors.gymTo && (
                <p className="text-red-500 text-sm mt-1">{errors.gymTo.message}</p>
              )}
            </div>
          </div>

          {/* Days Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Days:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {days.map(day => (
                <label key={day} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedDays.gym.includes(day)}
                    onChange={() => handleDayToggle('gym', day)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-sm text-gray-700">{day}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Travel Section */}
      <div className=" rounded-lg p-6  ">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Travel:</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              From (current month):
            </label>
            <input
              {...register('travelFrom', { 
                required: 'Travel start date/time is required',
                validate: (value) => {
                  if (!value) return 'Travel start date/time is required'
                  const d = new Date(value)
                  return (d >= monthStart && d <= monthEnd) || 'Travel must be within the current month'
                }
              })}
              type="datetime-local"
              min={travelMin}
              max={travelMax}
              className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
            {errors.travelFrom && (
              <p className="text-red-500 text-sm mt-1">{errors.travelFrom.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              To (current month):
            </label>
            <input
              {...register('travelTo', { 
                required: 'Travel end date/time is required',
                validate: (value) => {
                  if (!value) return 'Travel end date/time is required'
                  const d = new Date(value)
                  return (d >= monthStart && d <= monthEnd) || 'Travel must be within the current month'
                }
              })}
              type="datetime-local"
              min={travelMin}
              max={travelMax}
              className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
            {errors.travelTo && (
              <p className="text-red-500 text-sm mt-1">{errors.travelTo.message}</p>
            )}
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
          disabled={isLoading}
          className={`px-8 py-3 rounded-lg font-semibold transition-colors ${isLoading ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'}`}
        >
          {isLoading ? 'Processing...' : 'Next'}
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

export default Step3Planning
