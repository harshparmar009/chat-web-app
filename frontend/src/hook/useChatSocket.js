// src/hook/useChatSocket.js
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  addNewMessage,
  setTypingStatus,
  updateMessagesSeen,
} from "../features/chat/chatSlice";
import { getSocket } from "../service/socket.js";

const useChatSocket = (selectedUserId, currentUserId) => {
  const dispatch = useDispatch();
  const socket = getSocket();

  useEffect(() => {
    if (!socket) return;

    // --- messagesSeen (server notifies that messages were seen)
    const handleMessagesSeen = ({ userId, friendId }) => {
      // friendId is who saw messages (server payload in your app)
      // updateMessagesSeen should mark messages from userId as seen in the current open chat.
      if (friendId === selectedUserId) {
        dispatch(updateMessagesSeen(userId));
      }
    };

    // --- receive_message (server -> client when a new message arrives)
    const handleReceiveMessage = ({ newMessage }) => {
      // Add incoming message if it belongs to this opened chat (sender or receiver is selected user)
      if (
        newMessage.sender === selectedUserId ||
        newMessage.receiver === selectedUserId
      ) {
        dispatch(addNewMessage(newMessage));
      }
    };

    // --- typing / stopTyping
    const handleTyping = ({ senderId }) => {
      if (senderId === selectedUserId) dispatch(setTypingStatus(true));
    };
    const handleStopTyping = ({ senderId }) => {
      if (senderId === selectedUserId) dispatch(setTypingStatus(false));
    };

    socket.on("messagesSeen", handleMessagesSeen);
    socket.on("receive_message", handleReceiveMessage);
    socket.on("typing", handleTyping);
    socket.on("stopTyping", handleStopTyping);

    return () => {
      socket.off("messagesSeen", handleMessagesSeen);
      socket.off("receive_message", handleReceiveMessage);
      socket.off("typing", handleTyping);
      socket.off("stopTyping", handleStopTyping);
    };
  }, [getSocket, socket, selectedUserId, currentUserId, dispatch]);
};

export default useChatSocket;
