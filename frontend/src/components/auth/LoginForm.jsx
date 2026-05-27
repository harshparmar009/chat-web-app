import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../features/auth/authApi.js";
import { setCredential } from "../../features/auth/authSlice.js";
import { registerToken } from "../../hook/useNotification.js";

const LoginForm = () => {


  const {isAuthenticated } = useSelector(state => state.auth)

  const [login, { isLoading, error }] = useLoginMutation();

  const dispatch = useDispatch();
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const userName = e.target.userName.value;
    const password = e.target.password.value;

    // login
    const res = await login({
      userName,
      password,
    }).unwrap();

    // save auth
    dispatch(
      setCredential({
        user: res.user,
        accessToken: res.accessToken,
      })
    );

    // generate firebase token
    const { permission, token } =
      await registerToken();

    console.log(permission, token);

    // send token to backend
    if (permission === "granted" && token) {
      await fetch(
        `${import.meta.env.VITE_CLIENT_URI}/auth/register-token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${res.accessToken}`,
          },
          body: JSON.stringify({
            token,
          }),
        }
      );

      console.log("FCM token saved ✅");
    }
  } catch (error) {
    console.log("login failed", error);
  }
};

  useEffect(() => {
    if (isAuthenticated) {
      console.log("Login success!");
      navigate("/inbox"); 
    }
  }, [isAuthenticated]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4 flex items-center flex-col text-black ">
      <input name="userName" placeholder="Username" required className="input input-bordered w-full pl-10 text-black" />
      <input name="password" placeholder="Password" type="password" required className="input input-bordered w-full pl-10 text-black"/>
      <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-transparent border-2 border-indigo-600 rounded-xl transition duration-300 transform hover:scale-105 hover:bg-indigo-600 hover:shadow-md hover:shadow-indigo-500/50">Login</button>
      {error && <p style={{ color: "red" }}>{`${error.data.message}`}</p>}
    {isLoading && <h2 className="text-white">loading....</h2>}
      <p className="text-sm text-center text-white">
        Don't have an account?{" "}
        <Link to="/signup" className="text-blue-600 hover:underline">Sign up</Link>
      </p>
    </form>

  );
};

export default LoginForm;
