import { Server, Socket } from "socket.io";
import { users, rooms } from "../dataStorage";

export function readySetGo (io: Server, socket: Socket, roomId: string, isCreating: boolean, onTimeout: () => void): void {
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
        }else if (currentTime === 3) {
            io.to(roomId).emit('time', "Ready");
        }else if (currentTime > 3) {
            io.to(roomId).emit('update_cooldown',true);
            if (isCreating) {
                socket.emit('turn', "Your turn to create a pattern");
                socket.to(roomId).emit('turn', 'Waiting for another player to create a pattern');
            }else{
                socket.to(roomId).emit('turn', "Your turn to follow a pattern");
                socket.emit('turn', 'Waiting for another player to follow your pattern');
            }
        }
        currentTime--;
    }, 1000);
}

export function startCreate (io: Server, socket: Socket, sid: string, roomId: string, round: number): void {
    io.to(sid).emit('start_create');
    // io.to(roomId).emit('start_turn', { round: round }); // to reset timer
    return;
}

export function winner (roomId: string) {
    // find winner
    const playersInRoom = users.filter((user) => user.roomId === roomId);

    let winner = playersInRoom[0];

    if (playersInRoom[0] && playersInRoom[1]) {
        // check if tie
        if (playersInRoom[0].score === playersInRoom[1].score) {
            // tie = true;
            console.log("this match is a tie");

            playersInRoom.forEach((playerInRoom) => {
                playerInRoom.score = 0;
                playerInRoom.ready = false;
                playerInRoom.P1 = false;
            });

            return { tie: true, winner: "none" };
        } else {
            const maxScore = Math.max(playersInRoom[0].score, playersInRoom[1].score);

            for (const playerInRoom of playersInRoom) {
                if (playerInRoom.score === maxScore) {
                    winner = playerInRoom;
                    console.log("winner: ", winner.username);

                    playerInRoom.P1 = true;
                } else {
                    playerInRoom.P1 = false;
                }
            }
            return { tie: false, winner: winner.username };
        }
    } else {
        return { tie: false, winner: "there's some errorrrrr" };
    }
}