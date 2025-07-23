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
}

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers:{
        setSelectedUser: (state, action) => {
            state.selectedUser = action.payload
            
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
    },
})
export const { setSelectedUser, collectMessages, addNewMessage, clearMessages, setTypingStatus } = chatSlice.actions

export default chatSlice.reducer