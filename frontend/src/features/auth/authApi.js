
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
      query: (formData) => ({
        url: '/auth/update-profile',
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: ['Auth'],
    }),

    search: builder.query({
      query: (userName) => `/auth/search/${userName}`
     }),

  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetMeQuery,
  useRefreshQuery,
  useSearchQuery,
  useLogoutMutation,
  useUpdateProfileMutation,
} = authApi;
