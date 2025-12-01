import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useSearchParams, useNavigate } from 'react-router-dom'
import Step1Register from './Step1Register'
import Step2Measurement from './Step2Measurement'
import Step3Planning from './Step3Planning'
import Step4Policy from './Step4Policy'
import Step5Review from './Step5Review'
import Step6Profile from './Step6Profile'
import StepProgress from './StepProgress'
import { useAPI } from '../../contexts/ApiContext'
import { useAPP } from '../../contexts/AppContext'

const Signup = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const stepTitleArray = ['Register', 'Measurement', 'Planning', 'Policy', 'Review', 'Profile'];
  const totalSteps = 6

  // Extract query parameters
  const urlMessage = searchParams.get('message');
  const urlEmail = searchParams.get('email');
  const urlName = searchParams.get('name');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    getValues,
    reset
  } = useForm({
    defaultValues: {
      // Step 1 - Personal Information
      firstName: urlName ? urlName.split(' ')[0] || '' : '',
      lastName: urlName ? urlName.split(' ').slice(1).join(' ') || '' : '',
      middleName: '',
      email: urlEmail || '',
      password: '',
      confirmPassword: '',
      
      // Step 1 - Location Information
      location: '',
      country: '',
      state: '',
      city: '',
      address: '',
      
      // Step 1 - User Type
      userType: 'User',
      
      // Step 2 - Measurement
      length: '',
      chest: '',
      waist: '',
      hips: '',
      
      // Step 3 - Planning
      workFrom: '',
      workTo: '',
      gymFrom: '',
      gymTo: '',
      travelFrom: '',
      travelTo: '',
      
      // Step 4 - Policy
      termsAccepted: false,
      dataProcessing: false,
      marketingConsent: false,
      
      // Step 5 - Review
      newsletter: false
    }
  })

  // Load saved progress from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('signupProgress')
    if (savedData) {
      try {
        const { step, formData, timestamp } = JSON.parse(savedData)
        const now = new Date().getTime()
        const oneDay = 24 * 60 * 60 * 1000 // 1 day in milliseconds        
        // Check if saved data is less than 1 day old
        if (now - timestamp < oneDay) {
          setCurrentStep(step)
          reset(formData)
        } else {
          // Clear expired data
          localStorage.removeItem('signupProgress')
        }
      } catch (error) {
        console.error('Error loading saved progress:', error)
        localStorage.removeItem('signupProgress')
      }
    }
  }, [reset])

  // Save progress to localStorage whenever step or form data changes
  useEffect(() => {
    // Don't save on step 6 (profile completion) - it will be cleared anyway
    if (currentStep === 6) return

    const formData = getValues()
    const progressData = {
      step: currentStep,
      formData: formData,
      timestamp: new Date().getTime()
    }
    
    // Only save if we're not on the first step (to avoid saving empty form)
    if (currentStep > 1) {
      localStorage.setItem('signupProgress', JSON.stringify(progressData))
    }
  }, [currentStep, getValues])

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }
  const onSubmit = (data) => {
    console.log('Form submitted:', data)
    // Clear saved progress after successful submission
    localStorage.removeItem('signupProgress');

    // If this is the 'Complete Registration' submit (step before final profile), call /complete-profile
    if (currentStep === totalSteps - 1) {
      (async () => {
        try {
          // call complete-profile using ApiContext (will attach tokens)
          const res = await api.get('/auth/complete-profile')
          console.log('Complete profile response:', res)
          // advance to profile step after successful completion
          nextStep()
        } catch (err) {
          console.error('Complete profile error:', err)
          const message = err?.response?.data?.message || err.message || 'An error occurred while completing profile.'
          // store or show error - for now log and don't advance
          setStep1Error(message)
        }
      })()
      return
    }

    // otherwise advance to next step
    nextStep();
  }

  // Handler for Step 1 registration API call (POST or PUT depending on existing user)
  const api = useAPI()
  const { user: appUser, login } = useAPP()
  const [step1Loading, setStep1Loading] = useState(false)
  const [step1Error, setStep1Error] = useState(null)
  const [savedUserId, setSavedUserId] = useState(() => {
    try {
      return localStorage.getItem('signup_user_id') || null
    } catch {
      return null
    }
  })

  // Measurement id for Step 2 (persist so subsequent edits use PUT)
  const [measurementId, setMeasurementId] = useState(() => {
    try { return localStorage.getItem('measurement_id') || null } catch { return null }
  })

  const [step2Loading, setStep2Loading] = useState(false)
  const [step2Error, setStep2Error] = useState(null)

  // Planning ids for Step 3 (persist so subsequent edits use PUT)
  const [planningIds, setPlanningIds] = useState(() => {
    try { 
      const saved = localStorage.getItem('planning_ids')
      return saved ? JSON.parse(saved) : { work: null, gym: null, travel: null }
    } catch { 
      return { work: null, gym: null, travel: null }
    }
  })

  const [step3Loading, setStep3Loading] = useState(false)
  const [step3Error, setStep3Error] = useState(null)
  const [measurementImage, setMeasurementImage] = useState(() => {
    try { return localStorage.getItem('measurement_image') || null } catch { return null }
  })

  // State for profile completion
  const [profileCompleting, setProfileCompleting] = useState(false)
  const [profileCompletionError, setProfileCompletionError] = useState(null)

  // Clear all signup-related data from localStorage
  const clearSignupData = () => {
    try {
      // Remove signup progress
      localStorage.removeItem('signupProgress')
      
      // Remove measurement data
      localStorage.removeItem('measurement_id')
      localStorage.removeItem('measurement_image')
      
      // Remove planning data
      localStorage.removeItem('planning_ids')
      
      // Remove user ID
      localStorage.removeItem('signup_user_id')
      
      console.log('✅ All signup data cleared from localStorage')
    } catch (error) {
      console.error('Error clearing signup data:', error)
    }
  }

  // Fetch user profile from /auth/profile and update AppContext
  // fetchUserProfile optionally accepts a redirectPath to navigate after successful fetch
  const fetchUserProfile = async (redirectPath = '/') => {
    setProfileCompleting(true)
    setProfileCompletionError(null)

    try {
      console.log('Fetching user profile from /auth/profile...')
      const response = await api.get('/auth/profile')
      const data = response?.data || response

      // Extract user and tokens from various response shapes
      const profileUser = data?.user || data?.data?.user || (data?.id ? data : null)
      const profileTokens = data?.tokens || data?.data?.tokens || 
        (data?.accessToken ? { 
          accessToken: data.accessToken, 
          refreshToken: data.refreshToken 
        } : null)

      if (profileUser) {
        console.log('✅ User profile fetched successfully:', profileUser)

        // Update AppContext with full user profile
        if (profileTokens) {
          login({ ...profileUser, tokens: profileTokens })
        } else {
          login(profileUser)
        }

        // Persist tokens to localStorage if available
        if (profileTokens) {
          try {
            if (profileTokens.accessToken) {
              localStorage.setItem('accessToken', profileTokens.accessToken)
            }
            if (profileTokens.refreshToken) {
              localStorage.setItem('refreshToken', profileTokens.refreshToken)
            }
          } catch (err) {
            console.error('Error persisting tokens:', err)
          }
        }

        // Clear all signup-related data
        clearSignupData()

        // Navigate to the provided redirect path after a brief delay
        setTimeout(() => {
          navigate(redirectPath, { replace: true })
        }, 2000)
      } else {
        throw new Error('Unable to retrieve user profile')
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
      const message = error?.response?.data?.message || error.message || 'Failed to complete profile setup'
      setProfileCompletionError(message)
      
      // Even if profile fetch fails, clear signup data and navigate to redirectPath
      clearSignupData()
      setTimeout(() => {
        navigate(redirectPath, { replace: true })
      }, 2000)
    } finally {
      setProfileCompleting(false)
    }
  }

  // Handle profile completion (Step 6)
  const handleProfileCompletion = async () => {
    // After completing profile, redirect user to the Wardrobe page
    await fetchUserProfile('/wardrobe')
  }

  const handleStep2 = async (data) => {
    // data contains length, chest, waist, hips, image (File object if provided)
    setStep2Loading(true)
    setStep2Error(null)
    try {
      let res
      
      // Build FormData for multipart upload
      const formData = new FormData()
      
      // Add measurement fields only if they have values
      if (data.length) formData.append('length', String(data.length))
      if (data.chest) formData.append('chest', String(data.chest))
      if (data.waist) formData.append('waist', String(data.waist))
      if (data.hips) formData.append('hips', String(data.hips))
      
      // Add image file if provided (File object)
      if (data.image instanceof File) {
        formData.append('image', data.image)
      }

      if (measurementId) {
        // Update existing measurement (PUT)
        res = await api.put(`/measurements/${measurementId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        console.log('Measurement update response:', res)
        // If response returned a new image URL, persist it
        try {
          const maybeImage = res?.data?.image || res?.data?.data?.image || res?.image || null
          if (maybeImage) {
            setMeasurementImage(maybeImage)
            try { localStorage.setItem('measurement_image', maybeImage) } catch (err) { console.error(err) }
          }
        } catch (err) { console.error(err) }
      } else {
        // Create new measurement
        res = await api.post('/measurements', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        console.log('Measurement create response:', res)

        // Try to extract id from response and persist it
        try {
          const maybeId = res?.id || res?.data?.id || res?.data?.data?.id || res?.data?.measurement?.id || null
          if (maybeId) {
            setMeasurementId(maybeId)
            try { localStorage.setItem('measurement_id', String(maybeId)) } catch (err) { console.error(err) }
          }
          // Try to extract returned image URL and persist it
          const maybeImage = res?.data?.image || res?.data?.data?.image || res?.image || null
          if (maybeImage) {
            setMeasurementImage(maybeImage)
            try { localStorage.setItem('measurement_image', maybeImage) } catch (err) { console.error(err) }
          }
        } catch (err) {
          console.error('Could not parse measurement response', err)
        }
      }

      // Advance to next step on success
      nextStep()
    } catch (err) {
      console.error('Measurement error:', err)
      const message = err?.response?.data?.message || err.message || 'An error occurred'
      setStep2Error(message)
    } finally {
      setStep2Loading(false)
    }
  }

  const handleStep3 = async (formData, selectedDays) => {
    // Map day names to weekday IDs (Monday = 1, Sunday = 0)
    const dayNameToWeekdayId = {
      'Sunday': 0,
      'Monday': 1,
      'Tuesday': 2,
      'Wednesday': 3,
      'Thursday': 4,
      'Friday': 5,
      'Saturday': 6
    }

    setStep3Loading(true)
    setStep3Error(null)

    try {
      const planningRequests = []
      const newPlanningIds = { ...planningIds }

      // Work planning
      if (formData.workFrom && formData.workTo && selectedDays.work.length > 0) {
        const workPayload = {
          type: "work",
          weekday_ids: selectedDays.work.map(day => dayNameToWeekdayId[day]),
          from_time: formData.workFrom,
          to_time: formData.workTo
        }
        
        if (planningIds.work) {
          // Update existing work planning
          planningRequests.push(api.put(`/planning/${planningIds.work}`, workPayload))
        } else {
          // Create new work planning
          planningRequests.push(api.post('/planning', workPayload).then(res => {
            const id = res?.id || res?.data?.id || res?.data?.data?.id
            if (id) newPlanningIds.work = id
            return res
          }))
        }
      }

      // Gym planning
      if (formData.gymFrom && formData.gymTo && selectedDays.gym.length > 0) {
        const gymPayload = {
          type: "gym",
          weekday_ids: selectedDays.gym.map(day => dayNameToWeekdayId[day]),
          from_time: formData.gymFrom,
          to_time: formData.gymTo
        }
        
        if (planningIds.gym) {
          // Update existing gym planning
          planningRequests.push(api.put(`/planning/${planningIds.gym}`, gymPayload))
        } else {
          // Create new gym planning
          planningRequests.push(api.post('/planning', gymPayload).then(res => {
            const id = res?.id || res?.data?.id || res?.data?.data?.id
            if (id) newPlanningIds.gym = id
            return res
          }))
        }
      }

      // Travel planning (uses datetime instead of time + weekdays)
      if (formData.travelFrom && formData.travelTo) {
        const travelFromDate = new Date(formData.travelFrom)
        const travelToDate = new Date(formData.travelTo)
        
        const travelPayload = {
          type: "travel",
          weekday_ids: [travelFromDate.getDay()], // day of week for travel start
          from_time: travelFromDate.toTimeString().slice(0, 5), // HH:MM format
          to_time: travelToDate.toTimeString().slice(0, 5)
        }
        
        if (planningIds.travel) {
          // Update existing travel planning
          planningRequests.push(api.put(`/planning/${planningIds.travel}`, travelPayload))
        } else {
          // Create new travel planning
          planningRequests.push(api.post('/planning', travelPayload).then(res => {
            const id = res?.id || res?.data?.id || res?.data?.data?.id
            if (id) newPlanningIds.travel = id
            return res
          }))
        }
      }

      // Execute all planning requests
      await Promise.all(planningRequests)
      
      // Save updated planning IDs
      setPlanningIds(newPlanningIds)
      try { localStorage.setItem('planning_ids', JSON.stringify(newPlanningIds)) } catch (err) { console.error(err) }

      console.log('Planning responses completed')
      nextStep()
    } catch (err) {
      console.error('Planning error:', err)
      const message = err?.response?.data?.message || err.message || 'An error occurred'
      setStep3Error(message)
    } finally {
      setStep3Loading(false)
    }
  }

  const handleStep1 = async (data) => {
    // Build payload to match API contract
    const payload = {
      firstName: data.firstName || '',
      middleName: data.middleName || '',
      lastName: data.lastName || '',
      email: data.email || '',
      password: data.password || '',
      addressLine: data.address || '',
      city: data.city || '',
      state: data.state || '',
      country: data.country || '',
      postalCode: data.postalCode || '',
      isPrimary: true
    }

    setStep1Loading(true)
    setStep1Error(null)
    try {
      let res
      // Decide between PUT (update) and POST (register)
      if (appUser && appUser.id) {
        // Update existing logged-in user
        res = await api.put('/users', payload)
        console.log('User update response:', res)
      } else if (savedUserId) {
        // We have a previously-created signup user in this flow -> update
        // include id in payload if backend requires it
        const payloadWithId = { ...payload, id: savedUserId }
        res = await api.put('/users', payloadWithId)
        console.log('Signup user update response:', res)
      } else {
        // Create new user (register)
        res = await api.post('/auth/register', payload)
        console.log('Register response:', res)

        // Try to extract tokens and user id from response
        try {
          // response shapes vary; handle several common forms
          const maybeTokens = res?.tokens || res?.data?.tokens || res?.data?.data?.tokens || res?.accessToken || res?.data?.accessToken ? {
            accessToken: res?.tokens?.accessToken || res?.data?.tokens?.accessToken || res?.data?.data?.tokens?.accessToken || res?.accessToken || res?.data?.accessToken,
            refreshToken: res?.tokens?.refreshToken || res?.data?.tokens?.refreshToken || res?.data?.data?.tokens?.refreshToken || res?.refreshToken || res?.data?.refreshToken
          } : null

          const maybeId = res?.id || res?.user?.id || res?.data?.id || res?.data?.user?.id || res?.data?.data?.id || null

          // Persist id for later PUTs
          if (maybeId) {
            setSavedUserId(maybeId)
            try { localStorage.setItem('signup_user_id', String(maybeId)) } catch (err) { console.error(err) }
          }

          // If we got tokens, save them and mark as logged in
          if (maybeTokens && maybeTokens.accessToken) {
            try {
              // If the response contains a user object, use it as the AppContext user and attach tokens
              const respUser = res?.data?.user || res?.user || null
              if (respUser) {
                login({ ...respUser, tokens: maybeTokens })
              } else {
                // Otherwise just set tokens so ApiContext can use them
                login({ tokens: maybeTokens })
              }
              if (maybeTokens.refreshToken) localStorage.setItem('refreshToken', maybeTokens.refreshToken)
              localStorage.setItem('accessToken', maybeTokens.accessToken)
            } catch (err) { console.error(err) }
          }
        } catch (err) {
          console.error('Could not parse register response', err)
        }
      }

      // On success, advance to next step
      nextStep()
    } catch (err) {
      console.error('Registration/update error:', err)
      // Put a simple error message for the UI
      const message = err?.response?.data?.message || err.message || 'An error occurred'
      setStep1Error(message)
    } finally {
      setStep1Loading(false)
    }
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1Register
            register={register}
            errors={errors}
            watch={watch}
            nextStep={nextStep}
            prevStep={prevStep}
            isFirstStep={true}
            isLastStep={false}
            handleSubmit={handleSubmit}
            onStep1Submit={handleStep1}
            isLoading={step1Loading}
            error={step1Error}
          />
        )
      case 2:
        return (
          <Step2Measurement
            register={register}
            errors={errors}
            watch={watch}
            nextStep={nextStep}
            prevStep={prevStep}
            isFirstStep={false}
            isLastStep={false}
            handleSubmit={handleSubmit}
            onStep2Submit={handleStep2}
            isLoading={step2Loading}
            error={step2Error}
            existingImage={measurementImage}
          />
        )
      case 3:
        return (
          <Step3Planning
            register={register}
            errors={errors}
            watch={watch}
            nextStep={nextStep}
            prevStep={prevStep}
            isFirstStep={false}
            isLastStep={false}
            handleSubmit={handleSubmit}
            onStep3Submit={handleStep3}
            isLoading={step3Loading}
            error={step3Error}
          />
        )
      case 4:
        return (
          <Step4Policy
            register={register}
            errors={errors}
            watch={watch}
            nextStep={nextStep}
            prevStep={prevStep}
            isFirstStep={false}
            isLastStep={false}
          />
        )
      case 5:
        return (
          <Step5Review
            register={register}
            errors={errors}
            watch={watch}
            nextStep={nextStep}
            prevStep={prevStep}
            isFirstStep={false}
            isLastStep={false}
            onSubmit={handleSubmit(onSubmit)}
          />
        )
      case 6:
        return (
          <Step6Profile
            register={register}
            errors={errors}
            watch={watch}
            nextStep={nextStep}
            prevStep={prevStep}
            isFirstStep={false}
            isLastStep={true}
            onSubmit={handleSubmit(onSubmit)}
            onComplete={handleProfileCompletion}
            isCompleting={profileCompleting}
            completionError={profileCompletionError}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-color-primary mb-4">
            Register
          </h1>
          <div className="w-full h-0.5 bg-[color:var(--text-color-primary)] mb-4"></div>
          
          {/* URL Message Display - only on step 1 */}
          {urlMessage && currentStep === 1 && (
            <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded mb-4">
              {decodeURIComponent(urlMessage)}
            </div>
          )}
          
          <div className="text-left">
            <h2 className="text-xl font-bold text-color-primary">
               {stepTitleArray[currentStep - 1]}
            </h2>
          </div>
        </div>

        {/* Form Container */}
        <div className=" rounded-lg  relative">
          {/* Background Decorative Element */}
          <div className="absolute top-1/2 right-0 transform -translate-y-1/2 opacity-10 pointer-events-none">
            <svg className="w-64 h-64 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>

          {/* Step Content */}
          {renderCurrentStep()}
        </div>

        {/* Progress Indicator */}
        <StepProgress currentStep={currentStep} totalSteps={totalSteps} />
      </div>
    </div>
  )
}

export default Signup
