import { Server, Socket } from "socket.io";
import { rooms, users } from "../dataStorage";

export default function serverHandler(io: Server, socket: Socket) {
  // Emit current user count to newly connected client
  socket.emit("users", users);

  // Handle user refresh request
  socket.on("server_users", () => {
    socket.emit("users", users); // Send updated user data to client
  });

  // Handle room restart request
  socket.on("server_restart", ({ roomId }) => {
    console.log(`Restarting ${roomId}`);
    const room = rooms.find((r) => r.roomId === roomId);

    if (room) {
      room.round = 1; // Reset room state
      io.to(roomId).emit("room_restarted", roomId); // Notify users in room
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
      users.splice(userIndex, 1); // Remove user from list
      io.emit("users", users); // Broadcast updated user list to all clients
    }
  });
}
