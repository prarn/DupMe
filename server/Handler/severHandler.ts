import { Server, Socket } from "socket.io";
import { rooms, users } from "../dataStorage";

export default function serverHandler(io: Server, socket: Socket) {
    const serverUpdatePlayerInRoom = (roomId: string) => {
        const playerInRoom = users.filter((user) => (user.roomId === roomId));
        const playerCount = playerInRoom.length;
    
        if (playerCount === 2) {
            io.to(playerInRoom[0].sid).emit('me', { name : playerInRoom[0].username, avatar: playerInRoom[0].avatar, score: playerInRoom[0].score})
            io.to(playerInRoom[0].sid).emit('opponent', { name : playerInRoom[1].username, avatar: playerInRoom[1].avatar, score: playerInRoom[1].score})
            io.to(playerInRoom[1].sid).emit('me', { name : playerInRoom[1].username, avatar: playerInRoom[1].avatar, score: playerInRoom[1].score})
            io.to(playerInRoom[1].sid).emit('opponent', { name : playerInRoom[0].username, avatar: playerInRoom[0].avatar, score: playerInRoom[0].score})
        }
    }
    
    // Emit current user count to newly connected client
    socket.emit("users", users);

    // Handle user refresh request
    socket.on("server_users", () => {
        socket.emit("users", users); // Send updated user data to client
    });

    // Handle room restart request
    socket.on("server_restart", ({ roomId }) => {
        console.log(`serverRestart ${roomId}`);
        const roomIndex = rooms.findIndex((room) => room.roomId === roomId);
        const playersInRoom = users.filter((user) => user.roomId === roomId);
    
        // set new properties
        playersInRoom.forEach((playerInRoom) => {
            playerInRoom.score = 0;
            playerInRoom.ready = false;
            playerInRoom.P1 = false;
        });
        
        rooms[roomIndex].round = 0;
        clearInterval(rooms[roomIndex].interval);
        rooms[roomIndex].countdown = 0;
        
        // send info to client
        // serverUpdatePlayerInRoom(roomId);
        io.to(roomId).emit('restart_server');
        io.to(roomId).emit('restart');
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
