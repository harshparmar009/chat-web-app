//this is my routes in server 
import { Router } from "express";
import { refreshController, signInController, signOutController, signUpController } from "../controllers/authController.js";
import { isAuthenticated } from "../utils/middlewares/authMiddleware.js";

const router = Router()

router.post("/login", signInController)
router.post("/register", signUpController)
router.get("/refresh", refreshController)

router.get("/me", isAuthenticated,  (req, res) => {
    res.status(200).json({ user: req.user,
      success: true
     }); 
  })
  
router.post("/logout", signOutController)  

export default router


// refresh route controler in server
export const refreshController = async (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: 'Refresh token missing' });
  
    try {
      const decoded = jwt.verify(token, process.env.REFRESH_SECRET);
      const user = await User.findById(decoded.userId);
      if (!user || user.refreshToken !== token) return res.status(403).json({ message: 'Invalid refresh token' });
  
      const newAccessToken = generateAccessToken(user);
      res.json({ accessToken: newAccessToken });
    } catch (err) {
      res.status(403).json({ message: 'Invalid or expired refresh token' });
    }
  };

  //this is isAuthenticated middleware in server 
import jwt from "jsonwebtoken";
import { User } from "../../models/userModel.js";

export const isAuthenticated = async(req, res, next) => {
 
 
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password")

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user; // Attach user to request
    // console.log(req.user.userName);
    
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

//here all client side codes

//this is my App.js code basically handle routes
<Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/chat" element={<Chat />} />

           {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

        </Routes>
      </Router>

//this is my loginform in client side
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../features/auth/authThunks";
import { Link, useNavigate } from "react-router-dom";

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, error, loading } = useSelector(
    (state) => state.auth
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userName = e.target.userName.value;
    const password = e.target.password.value;
    dispatch(loginUser({ userName, password }));
  };

  useEffect(() => {
    if (isAuthenticated) {
      console.log("Login success!");
    //   console.log("User Data:", user);
      navigate("/dashboard"); // or wherever
    }
  }, [isAuthenticated]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4 flex items-center flex-col">
      <input name="userName" placeholder="Username" required />
      <input name="password" placeholder="Password" type="password" required />
      <button type="submit">Login</button>
      {error && <p style={{ color: "red" }}>{`Error accur:${error}`}</p>}
    {loading && <h2>loading....</h2>}
      <p className="text-sm text-center">
        Don't have an account?{" "}
        <Link to="/signup" className="text-blue-600 hover:underline">Sign up</Link>
      </p>
    </form>

  );
};

export default LoginForm;

//this is my redux codes here
//authApi in /feature/auth/authApi
import API from '../../service/axios';

export const login = (credentials) => API.post('/login', credentials);
export const register = (data) => API.post('/register', data);
export const me = () => API.get('/me');
export const refresh = () => API.get('/refresh');
export const logout = () => API.post('/logout');

//authSlice in /feature/auth/authSlice
import { createSlice } from '@reduxjs/toolkit';
import { loginUser, registerUser, getMe, refreshToken, logoutUser } from './authThunks';

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  accessToken: localStorage.getItem('accessToken') || null,
  isRegister: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(loginUser.pending, state => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.loading = false;
        state.accessToken = action.payload.accessToken;
        localStorage.setItem('accessToken', action.payload.accessToken);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(registerUser.pending, state => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.isRegister = true
        state.user = null;       
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isRegister = false
      })

      .addCase(getMe.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        localStorage.setItem('accessToken', action.payload.accessToken);
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload?.message || 'Session expired';
      })
      .addCase(logoutUser.fulfilled, state => {
        state.user = null;
        state.isAuthenticated = false;
        localStorage.removeItem('accessToken');
      });
  },
});

export default authSlice.reducer;


//authThunks in /feature/auth/authThunks
import { createAsyncThunk } from '@reduxjs/toolkit';
import * as api from './authApi';

export const loginUser = createAsyncThunk('/login', async (data, thunkAPI) => {
  try {
    const res = await api.login(data);
    localStorage.setItem("accessToken", res.data.accessToken);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
});

export const registerUser = createAsyncThunk('/register', async (data, thunkAPI) => {
  try {
    const res = await api.register(data);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
});

export const getMe = createAsyncThunk('/me', async (_, thunkAPI) => {
  try {
    const res = await api.me();
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
});

export const refreshToken = createAsyncThunk('/refresh', async (_, thunkAPI) => {
  try {
    const res = await api.refresh();
    localStorage.setItem("accessToken", res.data.accessToken);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message);
  }
});

export const logoutUser = createAsyncThunk('/logout', async (_, thunkAPI) => {
  try {
    await api.logout();
    localStorage.removeItem("accessToken");
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
});

//this is my axos interceptor code 
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_CLIENT_URI,
  withCredentials: true, // needed for refresh token in cookies
});

// ✅ Automatically attach accessToken
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// ✅ Auto-refresh token on 401
api.interceptors.response.use(
  res => res,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await axios.get('/refresh', { withCredentials: true });
        const newAccessToken = res.data.accessToken;

        localStorage.setItem('accessToken', newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (err) {
        localStorage.removeItem('accessToken');
        window.location.href = '/signup';
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;


//this is my ProtectedRoute Code
// src/routes/ProtectedRoute.js
import { Navigate, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

const ProtectedRoute = () => {
  const { isAuthenticated } = useSelector(state => state.auth);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const verifyAuth = async () => {
      try {
        await useDispatch(getMe()).unwrap();
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
  
    verifyAuth();
  }, []);
  

  if (loading) return <div>Loading...</div>;

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
