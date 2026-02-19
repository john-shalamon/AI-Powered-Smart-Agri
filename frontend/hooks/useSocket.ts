import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

export const useSocket = (userId?: string, role?: string) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(API_BASE, {
        transports: ['websocket', 'polling'],
      });

      socketRef.current.on('connect', () => {
        console.log('Connected to server');

        if (userId) {
          socketRef.current?.emit('join-user', userId);
        }

        if (role) {
          socketRef.current?.emit('join-role', role);
        }
      });

      socketRef.current.on('disconnect', () => {
        console.log('Disconnected from server');
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [userId, role]);

  const emit = (event: string, data: any) => {
    socketRef.current?.emit(event, data);
  };

  const on = (event: string, callback: (data: any) => void) => {
    socketRef.current?.on(event, callback);
  };

  const off = (event: string, callback?: (data: any) => void) => {
    if (callback) {
      socketRef.current?.off(event, callback);
    } else {
      socketRef.current?.off(event);
    }
  };

  return { socket: socketRef.current, emit, on, off };
};