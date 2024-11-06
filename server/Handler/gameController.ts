import { Server, Socket } from "socket.io";
import { users, rooms } from "../dataStorage";

export function readySetGo (io: Server, socket: Socket, roomId: string, onTimeout: () => void): void {
    let currentTime = 5;
    const interval = setInterval(() => {
        if (currentTime === 0) {
            io.to(roomId).emit('time', "");
            io.to(roomId).emit('update_cooldown',false);
            onTimeout();
            clearInterval(interval);
        } else if (currentTime === 1) {
            io.to(roomId).emit('time', "Go");
        } else if (currentTime === 2) {
            io.to(roomId).emit('time', "Set");
        } else if (currentTime === 3) {
            io.to(roomId).emit('time', "Ready");
        }else if (currentTime >= 3) {
            io.to(roomId).emit('update_cooldown',true);
            socket.emit('turn', "Your turn to create a pattern");
            socket.to(roomId).emit('turn', 'Waiting for another player to create a pattern')
        }
        currentTime--;
    }, 1000);
}

export function startCreate (io: Server, socket: Socket, sid: string, roomId: string, round: number): void {
    io.to(sid).emit('start_create');
    io.to(roomId).emit('start_turn', { round: round }); // to reset timer
    return;
}