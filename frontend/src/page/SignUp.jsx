import React from 'react'
import SignUpForm from '../components/auth/SignUpForm'

const SignUp = () => {

  const pageStyle = {
    backgroundImage: 'radial-gradient(at 0% 0%, #1e3a8a 0%, transparent 50%), radial-gradient(at 100% 100%, #4c1d95 0%, transparent 50%)',
  };

  return (
    <div 
    style={pageStyle}
    className="min-h-screen flex items-center justify-center bg-slate-900 p-4 p-4 ">
      <div className="max-w-md w-full bg-slate-900/70 border-t border-slate-800 shadow-md rounded-2xl p-6">
        <h2 className="text-2xl font-semibold text-center mb-6 text-white">Sign Up</h2>
        <SignUpForm />
      </div>
    </div>
  )
}

export default SignUp
