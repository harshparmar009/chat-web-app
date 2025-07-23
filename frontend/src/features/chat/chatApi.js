import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from '../../service/customBaseQuery'; // same as you used for auth

export const messageApi = createApi({
  reducerPath: 'messageApi',
  baseQuery: customBaseQuery,
  tagTypes: ['Message'],
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: () => '/message/users',
      providesTags: ['Message'],
    }),

     // GET /message/:id
    getMessages: builder.query({
      query: (userId) => `/message/${userId}`,
      providesTags: (result, error, arg) =>
        result?.messages
          ? [
              ...result.messages.map((msg) => ({
                type: "Messages",
                id: msg._id,
              })),
              { type: "Messages", id: "LIST" },
            ]
          : [{ type: "Messages", id: "LIST" }],
    }),

    //Post /message/send/:id
    sendMessage: builder.mutation({
      query: ({ receiverId, text, image }) => ({
        url: `/message/send/${receiverId}`,
        method: "POST",
        body: { text, image },
      }),
      invalidatesTags: [{ type: "Messages", id: "LIST" }],
    }),

  }),
});

export const { useGetAllUsersQuery, 
  useGetMessagesQuery,
  useSendMessageMutation } = messageApi;
