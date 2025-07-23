// src/features/auth/authSlice.js
import { createSlice } from '@reduxjs/toolkit';
// import { loginUser, registerUser, logoutUser, refreshToken, getMe, updateProfile } from './auth.thunks.js'
// import getThunks from '../../hook/getThunks.js';

// const {loginUser, logoutUser, registerUser, updateProfile, getMe, refreshToken} = getThunks()

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  accessToken: localStorage.getItem('accessToken') || null,
  isRegister: false,
  authChecked: false,
  isUpdated: false,
  isUpdating: false,
  onlineUsers: [],
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredential: (state, action) => {
      state.user = action.payload.user
      state.accessToken = action.payload.accessToken
      state.isAuthenticated = true
      localStorage.setItem('accessToken', action.payload.accessToken);
    },
    logoutApi: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem('accessToken');
    },
    getOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload
    },
    refresh: (state, action) => {
      state.isAuthenticated = true;
      localStorage.setItem('accessToken', action.payload.accessToken);
      state.authChecked = true;
    },
    setAuthChecked: (state, action) => {
      state.authChecked = action.payload ?? true;
    }
  },
});

export const { getOnlineUsers, setCredential, logoutApi, setAuthChecked, refresh } = authSlice.actions
export default authSlice.reducer;
