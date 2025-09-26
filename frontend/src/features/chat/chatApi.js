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

    getAcceptedUsers: builder.query({
      query: () => '/message/accepted-users',
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

    //Chat Request
     chatRequest: builder.mutation({
      query: ({ senderId, receiverId }) => ({
        url: '/message/chat-request',
        method: 'POST',
        body: { senderId, receiverId },
      })
     }),

     //Get Chat Request Query
     getChatRequest: builder.query({
      query: (userId) => `/message/chat-request/${userId}`
     }),

     //Chat Request accept
     chatRequestAccept: builder.mutation({
      query: ( userId ) => ({
        url: '/message/chat-request/accept',
        method: 'POST',
        body: { userId },
      }),
      invalidatesTags: ["Request"],
     }),

     //Chat Request decline
     chatRequestDecline: builder.mutation({
      query: ({ userId }) => ({
        url: '/message/chat-request/decline',
        method: 'POST',
        body: { userId },
      })
     }),

     messageCounter: builder.query({
      query: () => "/message/message-counter", // adjust path to your backend route
      providesTags: ["Chats"],
    }),
    
  }),
});

export const { useGetAllUsersQuery, 
  useGetAcceptedUsersQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
useChatRequestMutation,
useGetChatRequestQuery,
useChatRequestAcceptMutation,
useChatRequestDeclineMutation,
useMessageCounterQuery,
} = messageApi;
