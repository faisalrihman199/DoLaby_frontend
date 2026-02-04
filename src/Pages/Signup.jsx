import React from 'react'
import SignupComponent from '../components/Signup/Signup'

const Signup = () => {
  return (
    <>
      <Helmet>
        <title>Create Your Account | Meraity.ai</title>
        <meta name="description" content="Join Meraity.ai and create your smart digital wardrobe with AI-powered fashion tools." />
      </Helmet>
      <SignupComponent />
    </>
  )
}

export default Signup