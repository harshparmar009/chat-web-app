import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice.js";
import chatReducer from "../features/chat/chatSlice.js"
import { authApi } from "../features/auth/authApi.js";
import { messageApi } from "../features/chat/chatApi.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,

    [authApi.reducerPath]: authApi.reducer,
    [messageApi.reducerPath]: messageApi.reducer,

  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authApi.middleware, messageApi.middleware),
  });

export default store;
