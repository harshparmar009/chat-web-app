import axios from 'axios';
// import store from '../store/store'; 
// import { refreshToken, logoutUser } from '../features/chat/authThunks.js';
import { useRefreshQuery, useLogoutMutation } from '../features/auth/authApi.js';

const API = axios.create({
  baseURL: import.meta.env.VITE_CLIENT_URI,
  withCredentials: true,
});

// Request Interceptor: Add access token to headers
API.interceptors.request.use(
  (config) => {
    // const state = store.getState();
    // const token = state.auth?.accessToken;
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle token expiration
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Token expired or unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        // const res = await store.dispatch(refreshToken()).unwrap();
        const res = await useRefreshQuery().unwrap()

        const newAccessToken = res.accessToken;

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return API(originalRequest);
      } catch (err) {
        // If refresh fails, logout user
        // store.dispatch(logoutUser());
        await useLogoutMutation()
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default API;


// import axios from 'axios';

// const API = axios.create({
//   baseURL: import.meta.env.VITE_CLIENT_URI,
//   withCredentials: true, // needed for refresh token in cookies
// });

// // ✅ Automatically attach accessToken
// API.interceptors.request.use(
//   config => {
//     const token = localStorage.getItem('accessToken');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   error => Promise.reject(error)
// );

// // ✅ Auto-refresh token on 401
// API.interceptors.response.use(
//   res => res,
//   async error => {
//     const originalRequest = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       try {
//         const res = await API.get('/refresh');
//         const newAccessToken = res.data.accessToken;

//         localStorage.setItem('accessToken', newAccessToken);
//         originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//         return API(originalRequest);
//       } catch (err) {
//         localStorage.removeItem('accessToken');
//         window.location.href = '/login';
//         return Promise.reject(err);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default API;
