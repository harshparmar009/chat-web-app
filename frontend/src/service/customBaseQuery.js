// src/service//customBaseQuery.js
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { refresh, logoutApi } from '../features/auth/authSlice';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_CLIENT_URI,
  credentials: 'include', // send cookies (refresh token)
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('accessToken');
    if (token) headers.set('Authorization', `Bearer ${token}`);
    return headers;
  },
});

export const customBaseQuery = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    // Access token might be expired → try to refresh
    const refreshResult = await baseQuery('/auth/refresh', api, extraOptions);

    if (refreshResult?.data?.accessToken) {
      const newToken = refreshResult.data.accessToken;
      localStorage.setItem('accessToken', newToken);
      api.dispatch(refresh({ accessToken: newToken }));

      // Retry the original request with new token
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logoutApi());
      localStorage.removeItem('accessToken');
    }
  }

  return result;
};
