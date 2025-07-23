// src/hooks/useChatSocket.js
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addNewMessage, setTypingStatus } from '../features/chat/chatSlice';
import { getSocket } from '../service/socket.js';

const useChatSocket = (selectedUserId, currentUserId) => {
  const dispatch = useDispatch();
  const socket = getSocket();

  useEffect(() => {
    if (!socket || !selectedUserId) return;

    const handleReceiveMessage = ({ newMessage }) => {
      if (
        newMessage.sender === selectedUserId ||
        newMessage.receiver === selectedUserId
      ) {
        dispatch(addNewMessage(newMessage));
      }
    };

    const handleTyping = ({ senderId }) => {
      if (senderId === selectedUserId) {
        dispatch(setTypingStatus(true));
      }
    };

    const handleStopTyping = ({ senderId }) => {
      if (senderId === selectedUserId) {
        dispatch(setTypingStatus(false));
      }
    };

    socket.on('receive_message', handleReceiveMessage);
    socket.on('typing', handleTyping);
    socket.on('stopTyping', handleStopTyping);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
      socket.off('typing', handleTyping);
      socket.off('stopTyping', handleStopTyping);
    };
  }, [socket, selectedUserId, dispatch]);
};

export default useChatSocket;
