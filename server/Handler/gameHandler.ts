//gameHandler.ts

import { Server, Socket } from "socket.io";
import { rooms, users } from "../dataStorage";
import { playerInfo } from "./playerController";
import { readySetGo, startCreate } from "./gameController";

function gameHandler(io:Server, socket: Socket) {
    const sendNoteList = (data: any) => {
        const user = users.find(user => user.sid === socket.id);
        if (user) {
            socket.to(user.roomId).emit('receive_noteslist', data);
            console.log('Note list sent to room:', user.roomId);
        } else {
            console.log('User not found in any room');
        }
    };
    
    const startCountdown = (duration: number) => {
        const user = users.find(user => user.sid === socket.id);
        if (!user || !user.roomId) {
            console.error("Room ID not found for user.");
            return;
        }
        const roomId = user.roomId;
        let countdown = duration;

        const interval = setInterval(() => {
            countdown--;
            io.to(roomId).emit("countdown_update", { countdown });

            if (countdown <= 0) {
                clearInterval(interval);
                io.to(roomId).emit("countdown_finished", { countdown: 0 });
            }
        }, 1000);

        // Stopping the countdown if "send_noteslist" is triggered
        socket.on('stop_countdown', () => {
            clearInterval(interval);
            io.to(roomId).emit('countdown_finished', { countdown: 0 });
        });
    };

    const ready = () => {
        // Info
        const userInfo = playerInfo(io, socket);
        const sid = socket.id
        const userIndex = userInfo.userIndex;
        const roomId = userInfo.roomId;
        const roomIndex = userInfo.roomIndex;

        if ((userIndex !== -1) && roomId && (roomIndex !== -1)) {
            // Set ready to true
            users[userIndex].ready = true;
        
            // Check both players
            const playersInRoom = users.filter((user) => user.roomId === roomId);
            if (playersInRoom[0] && playersInRoom[1]) {
                // for selecting mode
                socket.to(roomId).emit('opponent_ready', true);

                const bothPlayersReady = playersInRoom.every((player) => player.ready);

                if (bothPlayersReady) {
                    let firstPlayer = playersInRoom.find((player) => player.P1);
                    let p1sid = "";
                    let p1name = "";
                    let defaultp1 = "";
                    if (!firstPlayer) {
                        p1sid = Math.random() < 0.5 ? playersInRoom[0].sid : playersInRoom[1].sid;
        
                        // update P1 to true for the person who goes first
                        users.forEach((user) => {
                            if (user.sid === p1sid) {
                                user.P1 = true;
                                p1name = user.username;
                                defaultp1 = `${p1name} is the first player at random`
                            }
                        });
                    } else {
                        p1sid = firstPlayer.sid;
                        p1name = firstPlayer.username;
                        defaultp1 = `The winner ${p1name} is the first player`
                    }

                    rooms[roomIndex].round = 1;

                    io.to(roomId).emit('turn', { message: defaultp1 });
                    io.to(roomId).emit('start_game');
                    io.to(p1sid).emit('start_game_server');
                } else {
                    socket.emit('turn', { message: "Waiting for another player" });
                    console.log('waiting for another player')
                }
            } else {
                socket.emit('turn', { message: "Waiting for another player" });
                console.log('waiting for another player');
            }
        }
        return;
    }

    const startGame = () => {
        // Info
        const userInfo = playerInfo(io, socket);
        const sid = socket.id
        const userIndex = userInfo.userIndex;
        const roomId = userInfo.roomId;
        const roomIndex = userInfo.roomIndex;

        if ((userIndex !== -1) && roomId && (roomIndex !== -1)) {
            const round = rooms[roomIndex].round;
            // const mode = findMode(roomIndex);
            // const createDuration = mode.createDuration;
            const createDuration = 10;

            readySetGo(io, socket, roomId, () => {
                startCreate(io, socket, sid, roomId, round);
                startCountdown(createDuration);
            })
        }
        return;
    }

    const endCreate = () => {
        // Info
        const userInfo = playerInfo(io, socket);
        const sid = socket.id
        const userIndex = userInfo.userIndex;
        const roomId = userInfo.roomId;
        const roomIndex = userInfo.roomIndex;

        if ((userIndex !== -1) && roomId && (roomIndex !== -1)) {
            socket.to(roomId).emit('start_follow');
            socket.emit('turn', { message: "Waiting for another player to follow the pattern" });
            socket.to(roomId).emit('turn', { message: "Your turn to follow the pattern"});

            // const mode = findMode(roomIndex);
            // const createDuration = mode.createDuration;
            const followDuration = 20;
            readySetGo(io, socket, roomId, () => {
                startCountdown(followDuration);
            })
        }
        return;
    }

    socket.on("send_noteslist", sendNoteList);
    socket.on("ready", ready);
    socket.on("start_game", startGame);

    return () =>{
        socket.off("send_noteslist", sendNoteList);
        socket.off("ready", ready);
        socket.off("start_game", startGame);
    }
}
export default gameHandler;