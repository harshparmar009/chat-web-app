// import API from '../../service/axios.js';

// export const login = (credentials) => API.post('/auth/login', credentials);
// export const register = (data) => API.post('/auth/register', data);
// export const me = () => API.get('/auth/me');
// export const refresh = () => API.get('/auth/refresh');
// export const logout = () => API.post('/auth/logout');
// export const updateProfile = (data) => API.post("auth/update-profile", data)


// auth api handling using RTK's 
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from '../../service/customBaseQuery';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: customBaseQuery,
  tagTypes: ['Auth'],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: '/auth/login',
        method: 'POST',
        body: data,
      }),
    }),

    register: builder.mutation({
      query: (data) => ({
        url: '/auth/register',
        method: 'POST',
        body: data,
      }),
    }),

    getMe: builder.query({
      query: () => '/auth/me',
      providesTags: ['Auth'],
    }),

    refresh: builder.query({
      query: () => '/auth/refresh',
    }),

    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
    }),

    updateProfile: builder.mutation({
      query: (data) => ({
        url: '/auth/update-profile',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Auth'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetMeQuery,
  useRefreshQuery,
  useLogoutMutation,
  useUpdateProfileMutation,
} = authApi;
