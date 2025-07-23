import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRegisterMutation } from "../../features/auth/authApi.js";
import { Link, useNavigate } from "react-router-dom";

const SignUpForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, {isLoading, error}] = useRegisterMutation();
  // const { isRegister, error, loading } = useSelector(
  //   (state) => state.auth
  // );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userName = e.target.userName.value;
      const email = e.target.email.value;
      const password = e.target.password.value;
      await register({ userName, email, password }).unwrap()
      console.log("Sign Up success!");
      console.log("User Data:");
      navigate("/login"); 
    } catch (error) {
      console.error("Register failed:", error);
    }
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-4 flex items-center flex-col text-black">
      <input name="userName" placeholder="Username" required className="input input-bordered w-full pl-10 text-white"/>
      <input name="email" placeholder="Email" type="email" required className="input input-bordered w-full pl-10 text-white"/>
      <input name="password" placeholder="Password" type="password" required className="input input-bordered w-full pl-10 text-white"/>
      <button type="submit">Sign Up</button>
      {error && <p style={{ color: "red" }}>{`Error accur:${error}`}</p>}
    {isLoading && <h2>loading....</h2>}
      <p className="text-sm text-center">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
      </p>
    </form>

  );
};

export default SignUpForm;
