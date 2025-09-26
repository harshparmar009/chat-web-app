import { createSlice } from "@reduxjs/toolkit";
// import { getUsers } from "./chatThunk";

const initialState = {
    users: [],
    messages: [],
    error: null,
    loading: false,
    selectedUser: null,
    loading: true,
    typingStatus: false,
    userProfile: null
}

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers:{
        setSelectedUser: (state, action) => {
            state.selectedUser = action.payload
        },
        setUserProfile:(state, action) => {
            state.userProfile = action.payload
        },
        collectMessages: (state, action) => {
            state.messages = action.payload
            state.loading = false
        },
        addNewMessage: (state, action) => {
            state.messages.push(action.payload);
        },
        clearMessages: (state) => {
            state.messages = [];
            state.loading = true;
        },
        setTypingStatus: (state, action) => {
            state.typingStatus = action.payload;
        },
        setUserProfile: (state, action) => {
            state.userProfile = action.payload
        },
        updateMessagesSeen: (state, action) => {
            const { userId } = action.payload;
            state.messages = state.messages.map(msg =>
              msg.receiver === userId ? { ...msg, seen: true } : msg
            );
          },
          
    },
})

export const { setSelectedUser, collectMessages, addNewMessage,
     clearMessages, setTypingStatus, setUserProfile, updateMessagesSeen } = chatSlice.actions

export default chatSlice.reducer