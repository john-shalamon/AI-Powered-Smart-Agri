'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  joinUser: (userId: string) => void;
  joinRole: (role: string) => void;
  emitOrderUpdate: (data: any) => void;
  emitMarketDataUpdate: (data: any) => void;
  emitDiseaseAlert: (data: any) => void;
  emitNotification: (data: any) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

// Custom hook for listening to socket events
export const useSocketEvent = (event: string, callback: (...args: any[]) => void) => {
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on(event, callback);

    return () => {
      socket.off(event, callback);
    };
  }, [socket, event, callback]);
};

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketInstance = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001', {
      transports: ['websocket', 'polling'],
    });

    socketInstance.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to Socket.IO server');
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from Socket.IO server');
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const joinUser = useCallback((userId: string) => {
    if (socket) {
      socket.emit('join-user', userId);
    }
  }, [socket]);

  const joinRole = useCallback((role: string) => {
    if (socket) {
      socket.emit('join-role', role);
    }
  }, [socket]);

  const emitOrderUpdate = useCallback((data: any) => {
    if (socket) {
      socket.emit('order-update', data);
    }
  }, [socket]);

  const emitMarketDataUpdate = useCallback((data: any) => {
    if (socket) {
      socket.emit('market-data-update', data);
    }
  }, [socket]);

  const emitDiseaseAlert = useCallback((data: any) => {
    if (socket) {
      socket.emit('disease-alert', data);
    }
  }, [socket]);

  const emitNotification = useCallback((data: any) => {
    if (socket) {
      socket.emit('send-notification', data);
    }
  }, [socket]);

  const value: SocketContextType = {
    socket,
    isConnected,
    joinUser,
    joinRole,
    emitOrderUpdate,
    emitMarketDataUpdate,
    emitDiseaseAlert,
    emitNotification,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};