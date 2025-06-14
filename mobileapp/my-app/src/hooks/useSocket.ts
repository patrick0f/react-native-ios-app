import { useEffect, useCallback } from 'react';
import { socketService } from '../services/socketService';

interface UseSocketProps {
  onEntryAdded?: (data: any) => void;
  onEntryUpdated?: (data: any) => void;
  onEntryDeleted?: (data: any) => void;
}

export const useSocket = ({
  onEntryAdded,
  onEntryUpdated,
  onEntryDeleted,
}: UseSocketProps = {}) => {
  const socket = socketService.connect();

  useEffect(() => {
    if (!socket) return;

    // Join the entries room
    socketService.joinEntriesRoom();

    // Set up event listeners
    if (onEntryAdded) {
      socket.on('entry:added', onEntryAdded);
    }

    if (onEntryUpdated) {
      socket.on('entry:updated', onEntryUpdated);
    }

    if (onEntryDeleted) {
      socket.on('entry:deleted', onEntryDeleted);
    }

    // Cleanup function
    return () => {
      if (onEntryAdded) {
        socket.off('entry:added', onEntryAdded);
      }
      if (onEntryUpdated) {
        socket.off('entry:updated', onEntryUpdated);
      }
      if (onEntryDeleted) {
        socket.off('entry:deleted', onEntryDeleted);
      }
    };
  }, [socket, onEntryAdded, onEntryUpdated, onEntryDeleted]);

  // Helper function to emit events
  const emitEvent = useCallback((event: string, data: any) => {
    if (socket) {
      socket.emit(event, data);
    }
  }, [socket]);

  return {
    socket,
    emitEvent,
  };
}; 