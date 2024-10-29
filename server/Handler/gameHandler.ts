import { Server, Socket } from "socket.io";
import { rooms, users } from "../dataStorage";

function gameHandler(io:Server, socket: Socket) {
    const sendNoteList = (data: any) => {
        const user = users.find(user => user.sid === socket.id);
        if (user) {
            socket.to(user.roomId).emit('receive_noteslist', data.noteList);
            io.to(user.roomId).emit('countdown_finished', { countdown: 0 });
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

    socket.on("send_noteslist",sendNoteList);
    socket.on("start_game", (duration: number) => {
        startCountdown(duration);
    });

    return () =>{
        socket.off("send_noteslist",sendNoteList);
    }
}
export default gameHandler;