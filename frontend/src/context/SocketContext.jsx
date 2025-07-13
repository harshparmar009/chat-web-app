import React, { createContext, useContext, useMemo } from 'react';
import { io } from 'socket.io-client';

export const SocketContext = createContext();

export default function SocketProvider({ children }) {
  const socket = useMemo(() => io(import.meta.env.VITE_SERVER_URL), []);
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}

export function useSocketContext() {
    return useContext(SocketContext);
  }