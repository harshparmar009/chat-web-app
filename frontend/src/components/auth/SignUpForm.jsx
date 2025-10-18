import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRegisterMutation } from "../../features/auth/authApi.js";
import { Link, useNavigate } from "react-router-dom";
import  {Eye, EyeOff } from 'lucide-react'

const SignUpForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, {isLoading, error}] = useRegisterMutation();
  // const { isRegister, error, loading } = useSelector(
  //   (state) => state.auth
  // );

  const [pass,setPass] = useState("")
  const [email, setEmail] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [passwordValid, setPasswordValid] = useState(null);
  const [emailValid, setEmailValid] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userName = e.target.userName.value;
      const password = pass;
      await register({ userName, email, password }).unwrap()
      console.log("Sign Up success!");
      console.log("User Data:");
      navigate("/login"); 
    } catch (error) {
      console.error("Register failed:", error);
    }
  };

  const validateEmail = (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailValid(regex.test(value));
  };

  const validatePassword = (value) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    setPasswordValid(regex.test(value))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 flex items-center flex-col text-white ">
    <input name="userName" placeholder="Username" required className="input input-bordered w-full pl-10 text-white" />
    <input name="email" onChange={(e) => {setEmail(e.target.value); validateEmail(e.target.value) }} 
    value={email}
    placeholder="Email" type="email" required className="input input-bordered w-full pl-10 text-white"/>

        {emailValid !== null && (
            <p
              className={`text-sm  ${
                emailValid ? "text-green-600" : "text-red-500"
              }`}
            >
              {emailValid ? "Valid email ✅" : "Enter a valid email"}
            </p>
          )}
   
    <div className="relative w-full h-full">
    <input name="password" placeholder="Password" type={showPass ? "text" : "password"} 
    onChange={(e)=>{setPass(e.target.value)
      validatePassword(e.target.value)}
    } value={pass}
    required className="input input-bordered w-full pl-10 text-white"/>
    
    <span className="absolute right-2 top-2"
    onClick={() => setShowPass(!showPass)}>
      {showPass ?  <Eye/> : <EyeOff/> }
    </span>
    </div>

    {passwordValid !== null && (
            <p
              className={`text-sm ${
                passwordValid ? "text-green-600" : "text-red-500"
              }`}
            >
              {passwordValid
                ? "Strong password ✅"
                : "Must include 8+ chars, uppercase, lowercase, and number"}
            </p>
          )}

    <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-transparent border-2 border-indigo-600 rounded-xl transition duration-300 transform hover:scale-105 hover:bg-indigo-600 hover:shadow-md hover:shadow-indigo-500/50">Signup</button>
    {error && <p style={{ color: "red" }}>{`${error.data.message}`}</p>}
    {isLoading && <h2>loading....</h2>}
    <p className="text-sm text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
          </p>
    </form>
  );
};

export default SignUpForm;
