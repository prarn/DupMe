import { Server, Socket } from 'socket.io';
import { rooms, users } from '../dataStorage';

let roomCounter = 1;

function roomHandler(io: Server, socket: Socket) {
    const requestRooms = () => {
        socket.emit("update_rooms", rooms); // Send existing rooms to the client
    };
    const createRoom = () => {
        if (rooms.length < 3) {
            rooms.push({
            roomId: `Room${roomCounter++}`, 
            round: 1, 
            players: 0
        })}else{
            socket.emit('alert_roomfull');
        }
        io.emit('update_rooms',rooms);
    }
    // Delete Room
    const deleteRoom = (roomId: string) => {
        const roomIndex = rooms.findIndex(r => r.roomId === roomId);
        if (roomIndex !== -1) {
            rooms.splice(roomIndex, 1);  // Remove the room
            console.log(`Room deleted: ${roomId}`);

            // Emit updated room list to all clients
            io.emit('update_rooms', rooms);
        } else {
            console.log(`Room not found: ${roomId}`);
        }
    };

    const joinRoom = (roomId: string) => {
        const room = rooms.find(r => r.roomId === roomId);
        const user = users.find(u => u.sid === socket.id);

        if (room && user && room.players < 2) { // Ensure room isn't full
            user.roomId = roomId;  // Assign user to the room
            room.players += 1;  // Increment player count in the room

            console.log(`${socket.id} joined room: ${roomId}`);
            socket.join(roomId);  // Join the room on the socket

            // Emit updated rooms to all clients
            io.emit('update_rooms', rooms);
        } else if (!room) {
            console.log(`Room not found: ${roomId}`);
        } else if (room.players >= 2) {
            console.log(`Room ${roomId} is full`);
            socket.emit('alert_roomfull');  // Notify user room is full
        }
    };

    // Leave Room
    const leaveRoom = (roomId: string) => {
        const room = rooms.find(r => r.roomId === roomId);
        const user = users.find(u => u.sid === socket.id);

        if (room && user) {
            user.roomId = "";  // Clear the room assignment from the user
            room.players -= 1;  // Decrease the player count in the room
            socket.leave(roomId);  // Leave the socket room

            console.log(`${socket.id} left room: ${roomId}`);

            // If no players left, delete the room
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

    socket.on("request_rooms", requestRooms);
    socket.on('create_room',createRoom);
    socket.on('delete_room',deleteRoom);
    socket.on('join_room',joinRoom)
    socket.on('leave_room',leaveRoom)

    return () => {
        socket.off("request_rooms", requestRooms);
        socket.off('create_room',createRoom);
        socket.off('delete_room',deleteRoom);
        socket.off('join_room',joinRoom)
        socket.off('leave_room',leaveRoom)
    }
}

export default roomHandler;