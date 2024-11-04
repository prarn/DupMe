import { Server, Socket } from 'socket.io';
import { rooms, users } from '../dataStorage';

let roomCounter = 1;

function roomHandler(io: Server, socket: Socket) {
    const requestRooms = () => {
        socket.emit("update_rooms", rooms); // Send existing rooms to the client
    };

    const createRoom = () => {
        if (rooms.length < 3) {
            const turnDirection = Math.random() < 0.5 ? "left" : "right"; // Randomly choose left or right
            rooms.push({
                roomId: `Room${roomCounter++}`,
                round: 1,
                players: 0,
                turnDirection, // Set the turn direction
            });
            io.emit('update_rooms', rooms); // Emit updated rooms to all clients
        } else {
            socket.emit('alert_roomfull');
        }
    };

    const joinRoom = (roomId: string) => {
        const room = rooms.find(r => r.roomId === roomId);
        const user = users.find(u => u.sid === socket.id);

        if (room && user && room.players < 2) { // Ensure room isn't full
            user.roomId = roomId;  // Assign user to the room
            user.P1 = room.players === 0; // Set as Player 1 if they’re the first to join
            room.players += 1;  // Increment player count in the room

            console.log(`${socket.id} joined room: ${roomId} as ${user.P1 ? "Player 1" : "Player 2"}`);
            socket.join(roomId);  // Join the room on the socket

            // Emit updated rooms to all clients
            io.emit('update_rooms', rooms);

            // If both players have joined, start the game
            if (room.players === 2) {
                io.to(roomId).emit("start_game", room.turnDirection); // Notify both players to start the game
            }
        } else if (!room) {
            console.log(`Room not found: ${roomId}`);
        } else if (room.players >= 2) {
            console.log(`Room ${roomId} is full`);
            socket.emit('alert_roomfull');  // Notify user room is full
        }
    };

    // Leave Room function
    const leaveRoom = (roomId: string) => {
        const room = rooms.find(r => r.roomId === roomId);
        const user = users.find(u => u.sid === socket.id);

        if (room && user) {
            user.roomId = "";  // Clear the room assignment from the user
            user.P1 = false; // Clear the player role
            room.players -= 1;  // Decrease the player count in the room
            socket.leave(roomId);  // Leave the socket room

            console.log(`${socket.id} left room: ${roomId}`);

            // If no players are left, delete the room
            if (room.players === 0) {
                rooms.splice(rooms.indexOf(room), 1);
                console.log(`Room deleted: ${roomId}`);
            }

            // Emit the updated room list to all clients
            io.emit('update_rooms', rooms);
        } else {
            console.log(`Room or user not found for leaving: ${roomId}`);
        }
    };

    // Update current player event listener
    const updateCurrentPlayer = (player) => {
        const user = users.find(u => u.sid === socket.id);
        const roomId = user?.roomId;
        
        if (roomId) {
            // Broadcast to all clients in the same room
            socket.to(roomId).emit("current_player_updated", player);
        }
    };

    socket.on("update_current_player", updateCurrentPlayer); // Use named listener here

    socket.on("request_rooms", requestRooms);
    socket.on('create_room', createRoom);
    socket.on('join_room', joinRoom);
    socket.on('leave_room', leaveRoom);

    return () => {
        socket.off("request_rooms", requestRooms);
        socket.off('create_room', createRoom);
        socket.off('join_room', joinRoom);
        socket.off('leave_room', leaveRoom);
        socket.off("update_current_player", updateCurrentPlayer); // Cleanup with the listener function
    };
}

export default roomHandler;


