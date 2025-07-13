import { useContext } from 'react';
import { useSocketContext } from '../context/SocketContext';

export function useSocket() {
  return useSocketContext();
}