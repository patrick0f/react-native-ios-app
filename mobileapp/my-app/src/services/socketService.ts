import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5179';

class SocketService {
  private socket: Socket | null = null;
  private isConnecting: boolean = false;

  connect() {
    if (!this.socket && !this.isConnecting) {
      this.isConnecting = true;
      
      this.socket = io(SOCKET_URL, {
        path: '/socket.io',
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        transports: ['websocket', 'polling'],
        autoConnect: true,
        forceNew: false,
        timeout: 10000,
      });

      this.socket.on('connect', () => {
        console.log('Connected to socket server');
        this.isConnecting = false;
        this.socket?.emit('clientReady');
      });

      this.socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        this.isConnecting = false;
        // Attempt to reconnect after a delay
        setTimeout(() => {
          if (this.socket) {
            this.socket.connect();
          }
        }, 5000);
      });

      this.socket.on('disconnect', (reason) => {
        console.log('Disconnected from socket server:', reason);
        this.isConnecting = false;
      });

      this.socket.on('error', (error) => {
        console.error('Socket error:', error);
        this.isConnecting = false;
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnecting = false;
    }
  }

  getSocket() {
    return this.socket;
  }

  // Helper method to join the entries room
  joinEntriesRoom() {
    if (this.socket?.connected) {
      this.socket.emit('join', 'entries');
    }
  }
}

export const socketService = new SocketService(); 