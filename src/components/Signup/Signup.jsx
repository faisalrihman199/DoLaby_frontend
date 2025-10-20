import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Step1Register from './Step1Register'
import Step2Measurement from './Step2Measurement'
import Step3Planning from './Step3Planning'
import Step4Policy from './Step4Policy'
import Step5Review from './Step5Review'
import Step6Profile from './Step6Profile'
import StepProgress from './StepProgress'
import { useNavigate } from 'react-router-dom'

const Signup = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const stepTitleArray = ['Register', 'Measurement', 'Planning', 'Policy', 'Review', 'Profile'];
  const totalSteps = 6

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    getValues,
    reset
  } = useForm({
    defaultValues: {
      // Step 1 - Personal Information
      firstName: '',
      lastName: '',
      middleName: '',
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
    nextStep();
    
    // Handle form submission here
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
