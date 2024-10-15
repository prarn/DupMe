import { Server, Socket } from 'socket.io';
import socket from '../../cilent/src/socket';

export let rooms: {
    roomId: string,
    round: number, 
    players: number
}[] = [];

let roomCounter = 1;

function roomHandler(io: Server, socket: Socket) {
    const createRoom = () => {
        rooms.push({
            roomId: `Room${roomCounter++}`, 
            round: 1, 
            players: 0
        })
        io.emit('update_rooms',rooms);
    }
    const deleteRoom = () => {
    }

    const joinRoom = (roomId: string) => {
        const room = rooms.find(r => r.roomId === roomId);
        if (room) {
        room.players += 1; // Increment player count in the room
        console.log(`${socket.id} joined room: ${roomId}`);
        
        // Emit updated room list to all clients
        io.emit('update_rooms', rooms);
        } else {
        console.log(`Room not found: ${roomId}`);
        }
    }

    socket.on('create_room',createRoom);
    // socket.on('delete_room',deleteRoom);
    socket.on('join_room',joinRoom)
    // socket.on('leave_room',leaveRoom)

    return () => {
        socket.off('create_room',createRoom);
        // socket.off('delete_room',deleteRoom);
    }
}

export default roomHandler;