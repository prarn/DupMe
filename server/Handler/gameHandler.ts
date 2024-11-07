//gameHandler.ts

import { Server, Socket } from "socket.io";
import { rooms, users } from "../dataStorage";
import { playerInfo, updatePlayerInRoom } from "./playerController";
import { readySetGo, startCreate, winner } from "./gameController";

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
        const room = rooms.find(room => room.roomId === roomId);
        if (!room) {
            console.error("Room not found.");
            return;
        }
    
        // Initialize countdown
        room.countdown = duration;
    
        // Clear any existing interval for this room
        if (room.interval) {
            clearInterval(room.interval);
        }
    
        // Start the countdown interval and save it in the room's interval property
        room.interval = setInterval(() => {
            if (room.countdown !== undefined) {
                room.countdown--;
                io.to(roomId).emit("countdown_update", { countdown: room.countdown });
    
                if (room.countdown <= 0) {
                    clearInterval(room.interval);
                    room.interval = null;
                    io.to(roomId).emit("countdown_finished", { countdown: 0 });
                }
            }
        }, 1000);
    };

    const stopCountdown = () => {
        const user = users.find(user => user.sid === socket.id);
        if (!user || !user.roomId) {
            console.error("Room ID not found for user.");
            return;
        }
        const roomId = user.roomId;
        const room = rooms.find(room => room.roomId === user.roomId);
        if (!room) {
            console.error("Room not found.");
            return;
        }
        if (room && room.interval) {
            clearInterval(room.interval);
            room.interval = null;
            room.countdown = 0; // Reset countdown
            io.to(roomId).emit("countdown_finished", { countdown: 0 });
        }
    }

    const ready = () => {
        console.log('Ready function triggered');
        // Info
        const userInfo = playerInfo(io, socket);
        const sid = socket.id;
        const userIndex = userInfo.userIndex;
        const roomId = userInfo.roomId;
        const roomIndex = userInfo.roomIndex;
    
        if ((userIndex !== -1) && roomId && (roomIndex !== -1)) {
            console.log(`User ${sid} is in room ${roomId} and marked as ready.`);
            
            // Set ready to true
            users[userIndex].ready = true;
        
            // Check both players
            const playersInRoom = users.filter((user) => user.roomId === roomId);
            console.log(`Players in room ${roomId}:`, playersInRoom);
    
            if (playersInRoom[0] && playersInRoom[1]) {
                // for selecting mode
                // socket.to(roomId).emit('opponent_ready', true);
                console.log('Opponent ready message sent.');
    
                const bothPlayersReady = playersInRoom.every((player) => player.ready);
                console.log('Both players ready:', bothPlayersReady);
    
                if (bothPlayersReady) {
                    let firstPlayer = playersInRoom.find((player) => player.P1);
                    let p1sid = "";
                    let p1name = "";
                    // let defaultp1 = "";
                    
                    if (!firstPlayer) {
                        p1sid = Math.random() < 0.5 ? playersInRoom[0].sid : playersInRoom[1].sid;
        
                        // update P1 to true for the person who goes first
                        users.forEach((user) => {
                            if (user.sid === p1sid) {
                                user.P1 = true;
                                p1name = user.username;
                                // defaultp1 = `${p1name} is the first player at random`;
                            }
                        });
                    } else {
                        p1sid = firstPlayer.sid;
                        p1name = firstPlayer.username;
                        // defaultp1 = `The winner ${p1name} is the first player`;
                    }
    
                    rooms[roomIndex].round = 1;
                    console.log(`Starting game in room ${roomId}, first player is ${p1name}.`);
                    // console.log(`Updated player:`, playersInRoom)
    
                    // io.to(roomId).emit('turn', defaultp1 );
                    // io.to(roomId).emit('start_game');
                    io.to(p1sid).emit('start_game');
                    io.to(roomId).emit('waiting_message', "");
                } else {
                    socket.emit('waiting_message', "Waiting for another player");
                    console.log('Waiting for another player to be ready.');
                }
            } else {
                socket.emit('waiting_message', "Waiting for another player");
                console.log('Only one player in the room, waiting for another.');
            }
        } else {
            console.log('User not found in any room or invalid user/room index.');
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

            readySetGo(io, socket, roomId, true, () => {
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
            // socket.emit('turn', { message: "Waiting for another player to follow the pattern" });
            // socket.to(roomId).emit('turn', { message: "Your turn to follow the pattern"});

            // const mode = findMode(roomIndex);
            // const createDuration = mode.createDuration;
            const followDuration = 20;
            readySetGo(io, socket, roomId, false, () => {
                startCountdown(followDuration);
            })
        }
        return;
    }

    const endFollow = (data: any) => {
        // Info
        const userInfo = playerInfo(io, socket);
        const sid = socket.id
        const userIndex = userInfo.userIndex;
        const roomId = userInfo.roomId;
        const roomIndex = userInfo.roomIndex;

        if ((userIndex !== -1) && roomId && (roomIndex !== -1)) {
            const name = users[userIndex].username;
            
            // score
            const addScore = data;
            users[userIndex].score = users[userIndex].score + addScore;
            console.log(`${users[userIndex].username} add ${addScore} = ${users[userIndex].score}`);

            // io.to(roomId).emit('turn', { message: `${name} get ${addScore} score` });
            updatePlayerInRoom(io, socket, roomId);

            // time
            // const mode = findMode(roomIndex);
            // const createDuration = mode.createDuration;
            // const followDuration = mode.followDuration;

            // check ending
            if (users[userIndex].P1) { // If is P1
                if (rooms[roomIndex].round >= 2) { // Round 2 = end game
                    rooms[roomIndex].round = 0;
                    const result = winner(roomId);
                    if (result.tie) {
                        io.to(roomId).emit('update_winner', true);
                        io.to(roomId).emit('turn', "Tie !!");
                    } else {
                        io.to(roomId).emit('update_winner', true);
                        io.to(roomId).emit('turn', `The winner is ${result.winner}`);
                    }
                    // io.to(roomId).emit('end_game', result);
                } else { // Round 1 = continues
                    rooms[roomIndex].round++;
                    const round = rooms[roomIndex].round;
                    readySetGo(io, socket, roomId, true, () => {
                        startCreate(io, socket, sid, roomId, round);
                        startCountdown(10);
                    })
                }
            } else { // is not P1 = always start the next turn
                const round = rooms[roomIndex].round;
                readySetGo(io, socket, roomId, true, () => {
                    startCreate(io, socket, sid, roomId, round);
                    startCountdown(10);
                })
            }
        }
        return;
    }

    const clientRestart = () => {
        // Info
        const userInfo = playerInfo(io, socket);
        const sid = socket.id
        const userIndex = userInfo.userIndex;
        const roomId = userInfo.roomId;
        const roomIndex = userInfo.roomIndex;

        if ((userIndex !== -1) && roomId && (roomIndex !== -1)) {
            const playersInRoom = users.filter((user) => user.roomId === roomId);

            playersInRoom.forEach((playerInRoom) => {
                playerInRoom.score = 0;
                playerInRoom.ready = false;
            });

            rooms[roomIndex].round = 0;

            updatePlayerInRoom(io, socket, roomId);

            io.to(roomId).emit('restart', { round: 0 });
            // io.to(roomId).emit('opponent_ready', false);

            console.log(`client restart ${roomId}`)
        }
        return;
    }

    socket.on("send_noteslist", sendNoteList);
    socket.on("ready", ready);
    socket.on("start_game", startGame);
    socket.on("end_create",endCreate);
    socket.on("end_follow",endFollow);
    socket.on('stop_countdown', stopCountdown);
    socket.on('restart_game',clientRestart);

    return () =>{
        socket.off("send_noteslist", sendNoteList);
        socket.off("ready", ready);
        socket.off("start_game", startGame);
        socket.off("end_create",endCreate);
        socket.off("end_follow",endFollow);
        socket.off('stop_countdown', stopCountdown);
        socket.off('restart_game',clientRestart);
    }
}
export default gameHandler;