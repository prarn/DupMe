import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";
import path from "path";
import gameHandler from "./Handler/gameHandler";
import roomHandler from "./Handler/roomHandler";
import userHandler from "./Handler/userHandler";
import chatHandler from "./Handler/chatHandler";
import serverHandler from './Handler/severHandler';

const app = express();
app.use(cors());

// Serve HTML and static files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html')); // Ensure 'index.html' is in 'public' directory
});
app.use(express.static(path.join(__dirname, 'public')));  // Serve static files like script.js, CSS, images

// Create HTTP server and Socket.io instance
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Socket.io connection handling
io.on("connection", (socket: Socket) => {
  console.log(`User connected: ${socket.id}`);

  // Initialize game, room, user, and chat handlers
  gameHandler(io, socket);
  roomHandler(io, socket);
  userHandler(io, socket);
  chatHandler(io, socket);
  serverHandler(io, socket);
});

// Start the server
server.listen(3000, '0.0.0.0', () => {
  console.log('Server is listening on PORT:3000');
});
