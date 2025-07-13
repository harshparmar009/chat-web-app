import React, { useState } from 'react';
import API from '../api/axios.js'
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext.jsx';

const LoginSignUp = () => {

    const [userName, setUserName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [toggleAuth, setToggleAuth] = useState(true)

    const navigate = useNavigate()
    //check user 
    const User = useContext(UserContext)

    const handleToggle = () => {
        setToggleAuth((prev) => !prev)
    }

    const handleSubmit = async(e) => {
        e.preventDefault()


            if(toggleAuth){
              try {
                const res = await API.post("/register", {userName, email, password}, {
                  headers:{
                      'Content-Type':'application/json'
                  },
                  withCredentials:true
              })
                console.log(res.data); 
                if(res.data.success){
                  setToggleAuth(false)
                  
                }
              } catch (error) {
                console.log("err:", error?.response?.data?.message);
              }
      
            }else{
              //login
              try {
                const res = await API.post("/login", {userName, password}, {
                  headers:{
                      'Content-Type':'application/json'
                  },
                  withCredentials:true
              })

              // Save token local storage
              // localStorage.setItem("token", res.data.token);
              // console.log(res.data.token);
              


                console.log(res.data);
                // const token = res.data.token;
                if(res.data.success){
                  User.setUser(res.data.token)
                  navigate("/Chat")
                }
              } catch (error) {
                console.log(error);
              }
                
            }
        
    }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-500 to-indigo-700 px-4">
  <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8 w-full max-w-md text-white ">
    <h1 className="text-2xl font-bold text-center mb-6">
      {toggleAuth ? 'Sign Up Here!' : 'Login Here!'}
    </h1>

    <form onSubmit={handleSubmit} className="py-8">
      {/* Username */}
      <div className="flex flex-col">
        <label className="mb-1 font-semibold">Username</label>
        <input
          required
          type="text"
          value={userName}
          onChange={e => setUserName(e.target.value)}
          placeholder="Enter username"
          className="px-4 py-2 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

     {toggleAuth &&  
      (<div className="flex flex-col">
        <label className="mb-1 font-semibold">Email</label>
        <input
          required
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Enter email"
          className="px-4 py-2 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>)}

      {/* Password */}
      <div className="flex flex-col">
        <label className="mb-1 font-semibold">Password</label>
        <input
          required
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Enter password"
          className="px-4 py-2 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full py-3 mt-4 rounded-lg bg-blue-600 hover:bg-blue-700 transition text-white font-medium"
      >
        {toggleAuth ? 'Sign Up' : 'Login'}
      </button>
    </form>

    {/* Toggle Link */}
    <div className="mt-6 text-center">
      <button
        onClick={handleToggle}
        className="text-blue-200 hover:text-white underline font-semibold transition"
      >
        {toggleAuth ? 'Already have an account? Login!' : "Don't have an account? Sign Up!"}
      </button>
    </div>
  </div>
</div>

  )
}

export default LoginSignUp
