import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import entryRoutes from "./routes/entry.route.js";
import setupSocket from "./lib/socket.js";
import apiRoutes from "./routes/api.route.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const { broadcastToAll } = setupSocket(server);

const PORT = process.env.PORT || 5179;

// Middleware
app.use(express.json());
app.use(cors({
  origin: '*', // Allow all origins for development
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Expense Categorization API is running" });
});

// Make broadcastToAll available to routes
app.set('broadcastToAll', broadcastToAll);

// Routes
app.use("/api/entries", entryRoutes);
app.use('/api/ai', apiRoutes);

// Connect to MongoDB
connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB:", err);
  });
