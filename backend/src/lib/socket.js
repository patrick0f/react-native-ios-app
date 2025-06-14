import { Server } from "socket.io";

const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true
    },
    path: '/socket.io',
    transports: ['websocket', 'polling'],
    allowEIO3: true,
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // Store connected clients
  const connectedClients = new Map();

  // Handle connections in the default namespace '/'
  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);
    connectedClients.set(socket.id, socket);

    // Handle join room request
    socket.on('join', (room) => {
      socket.join(room);
      console.log(`Client ${socket.id} joined room: ${room}`);
    });

    // Handle client disconnection
    socket.on("disconnect", (reason) => {
      console.log(`Client disconnected: ${socket.id}, reason: ${reason}`);
      connectedClients.delete(socket.id);
    });

    // Handle reconnection
    socket.on("reconnect", (attemptNumber) => {
      console.log(`Client reconnected: ${socket.id} after ${attemptNumber} attempts`);
    });

    // Handle errors
    socket.on("error", (error) => {
      console.error(`Socket error for client ${socket.id}:`, error);
    });

    // Handle client ready state
    socket.on("clientReady", () => {
      console.log(`Client ${socket.id} is ready to receive updates`);
      // Automatically join the entries room when client is ready
      socket.join("entries");
    });
  });

  // Helper function to broadcast to all clients
  const broadcastToAll = (event, data) => {
    io.to("entries").emit(event, data);
  };

  return { io, broadcastToAll };
};

export default setupSocket;
