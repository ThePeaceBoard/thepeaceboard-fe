'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Socket, io } from 'socket.io-client';
import { useGlobalStore } from '../store/useGlobalStore';

interface SocketContextValue {
  socket: Socket | null;
  isConnected: boolean;
  emit: (event: string, data: any) => void;
  on: (event: string, callback: (data: any) => void) => void;
  off: (event: string, callback: (data: any) => void) => void;
  signForPeace: (signatureData: SignatureData) => void;
}

interface SocketProviderProps {
  children: React.ReactNode;
}

interface SignatureData {
  [key: string]: any;
}

interface ActiveUsersData {
  count: number;
}

interface HeatmapUpdate {
  countryCode: string;
  region: string;
  city: string;
  [key: string]: any;
}

interface SignForPeaceData {
  mapData?: any;
}

const SocketContext = createContext<SocketContextValue | null>(null);

const logger = {
  log: (...args: any[]) => console.log('🔌 Socket:', ...args),
  warn: (...args: any[]) => console.warn('⚠️ Socket:', ...args),
  error: (...args: any[]) => console.error('❌ Socket:', ...args),
};

export const useSocket = (): SocketContextValue => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  
  const { 
    setActiveUsers, 
    setTotalPledges, 
    setPeaceMapData, 
    setHeatmapData 
  } = useGlobalStore();

  useEffect(() => {
    const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_SERVER_URL!, {
      transports: ['websocket'],
      autoConnect: false
    });

    // Connection events
    socketInstance.on('connect', () => {
      logger.log('Connected successfully');
    });

    socketInstance.on('connect_error', (error: Error) => {
      logger.error('Connection error:', error.message);
    });

    socketInstance.on('disconnect', (reason: string) => {
      logger.warn('Disconnected:', reason);
    });

    // Server events with direct store updates
    socketInstance.on('activeUsersUpdate', (data: ActiveUsersData) => {
      logger.log('Active users update:', data.count);
      setActiveUsers(data.count);
    });

    socketInstance.on('peaceMapUpdate', (data: any) => {
      logger.log('Peace map update received:', data);
      setPeaceMapData(data);
    });

    socketInstance.on('heatmapSnapshotUpdate', (data: HeatmapUpdate[]) => {
      logger.log('Heatmap snapshot update received:', data);
      setHeatmapData(data);
    });

    socketInstance.on('heatmapSnapshotDiffUpdate', (data: HeatmapUpdate[]) => {
      logger.log('Heatmap diff update received:', data);
      const currentData = useGlobalStore.getState().heatmapData;
      const updatedData = [...currentData];
      data.forEach(update => {
        const index = updatedData.findIndex(
          item => item.countryCode === update.countryCode &&
                  item.region === update.region &&
                  item.city === update.city
        );
        if (index !== -1) {
          updatedData[index] = update;
        } else {
          updatedData.push(update);
        }
      });
      setHeatmapData(updatedData);
    });

    socketInstance.on('signForPeace', (data: SignForPeaceData) => {
      logger.log('Sign for peace event:', data);
      const currentPledges = useGlobalStore.getState().totalPledges;
      setTotalPledges(currentPledges + 1);
      if (data.mapData) {
        setPeaceMapData(data.mapData);
      }
    });

    socketInstance.on('signForPeaceAck', (data: any) => {
      logger.log('Sign for peace acknowledgment:', data);
    });

    // Error handling events
    socketInstance.on('validationError', (data: { message: string; errors: any[] }) => {
      logger.error('Validation error:', data.message, data.errors);
    });

    socketInstance.on('rateLimit', (data: { message: string }) => {
      logger.warn('Rate limit reached:', data.message);
    });

    setSocket(socketInstance);

    return () => {
      logger.log('Cleaning up socket connection');
      socketInstance.disconnect();
    };
  }, [setActiveUsers, setTotalPledges, setPeaceMapData, setHeatmapData]);

  const socketValue: SocketContextValue = {
    socket,
    isConnected: socket?.connected || false,
    emit: (event: string, data: any) => {
      if (socket?.connected) {
        logger.log(`Emitting ${event}:`, data);
        socket.emit(event, data);
      } else {
        logger.warn('Cannot emit - socket not connected');
      }
    },
    on: (event: string, callback: (data: any) => void) => {
      if (socket) {
        logger.log(`Subscribing to ${event}`);
        socket.on(event, callback);
      }
    },
    off: (event: string, callback: (data: any) => void) => {
      if (socket) {
        logger.log(`Unsubscribing from ${event}`);
        socket.off(event, callback);
      }
    },
    signForPeace: (signatureData: SignatureData) => {
      if (socket?.connected) {
        logger.log('Sending peace signature:', signatureData);
        socket.emit('signForPeace', signatureData);
      } else {
        logger.warn('Cannot sign for peace - socket not connected');
      }
    }
  };

  return (
    <SocketContext.Provider value={socketValue}>
      {children}
    </SocketContext.Provider>
  );
}; 