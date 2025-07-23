import { createAsyncThunk } from "@reduxjs/toolkit";
import * as api from '../features/auth/authApi.js'

const getThunks = () => {
     const loginUser = createAsyncThunk('auth/loginUser', async (data, thunkAPI) => {
        try {
          const res = await api.login(data);
          localStorage.setItem("accessToken", res.data.accessToken);
          return {
            user: res.data.user,
            accessToken: res.data.accessToken,
          }
        } catch (err) {
          return thunkAPI.rejectWithValue(err.response.data.message);
        }
      });

       const registerUser = createAsyncThunk('auth/registerUser', async (data, thunkAPI) => {
        try {
          const res = await api.register(data);
          return res.data;
        } catch (err) {
          return thunkAPI.rejectWithValue(err.response.data.message);
        }
      });
      
       const getMe = createAsyncThunk('auth/getMe', async (_, thunkAPI) => {
        try {
          const res = await api.me();
          return res.data;
        } catch (err) {
          return thunkAPI.rejectWithValue(err.response.data.message);
        }
      });
      
       const refreshToken = createAsyncThunk('auth/refreshToken', async (_, thunkAPI) => {
        try {
          const res = await api.refresh();
          localStorage.setItem("accessToken", res.data.accessToken);
          return res.data;
        } catch (err) {
          return thunkAPI.rejectWithValue(err.response?.data?.message);
        }
      });
      
       const logoutUser = createAsyncThunk('auth/logoutUser', async (_, thunkAPI) => {
        try {
          await api.logout();
          // localStorage.removeItem("accessToken");
        } catch (err) {
          return thunkAPI.rejectWithValue(err.response.data.message);
        }
      });
      
       const updateProfile = createAsyncThunk('auth/updateProfile', async(data, thunkAPI) => {
        try {
          await api.updateProfile(data);
          return res.data
        } catch (err) {
          return thunkAPI.rejectWithValue(err.response.data.message);
        }
      })

  return (
    loginUser, logoutUser, registerUser, updateProfile, getMe, refreshToken
  )
}

export default getThunks
