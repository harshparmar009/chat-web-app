import React from 'react'
import LoginForm from '../components/auth/LoginForm'

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white shadow-md rounded-2xl p-6">
        <h2 className="text-2xl font-semibold text-center mb-6 text-black">Login</h2>
        <LoginForm />
      </div>
    </div>
  )
}

export default Login
