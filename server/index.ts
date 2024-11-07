import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";
import path from "path";
import gameHandler from "./Handler/gameHandler";
import roomHandler from "./Handler/roomHandler";
import userHandler from "./Handler/userHandler";
import chatHandler from "./Handler/chatHandler";
import { users, rooms } from "./dataStorage";  // Assuming user and room data are stored here

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

  // Emit current user count to newly connected client
  socket.emit('users', users);

  // Handle user refresh request
  socket.on('server_users', () => {
    socket.emit('users', users);  // Send updated user data to client
  });

  // Handle room restart request
  socket.on('server_restart', ({ roomId }) => {
    console.log(`Restarting ${roomId}`);
    const room = rooms.find((r) => r.roomId === roomId);

    if (room) {
      room.round = 1;  // Reset room state
      io.to(roomId).emit('room_restarted', roomId);  // Notify users in room
      console.log(`${roomId} has been restarted.`);
    } else {
      console.log(`Room ${roomId} not found.`);
    }
  });

  // Handle user disconnect
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    const userIndex = users.findIndex((user) => user.sid === socket.id);
    if (userIndex !== -1) {
      users.splice(userIndex, 1);  // Remove user from list
      io.emit('users', users);  // Broadcast updated user list to all clients
    }
  });
});

// Start the server
server.listen(3000, '0.0.0.0', () => {
  console.log('Server is listening on PORT:3000');
});
