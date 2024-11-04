//gameHandler.ts
import { Server, Socket } from "socket.io";
import { users } from "../dataStorage";

function gameHandler(io: Server, socket: Socket) {
    const sendNoteList = (data: any) => {
        const user = users.find(user => user.sid === socket.id);
        if (user) {
            socket.to(user.roomId).emit('receive_noteslist', data);
            io.to(user.roomId).emit('countdown_finished', { countdown: 0, player: true }); // Player 1's turn ends
            startCountdown(20, false); // Start countdown for Player 2
            user.P1 = false; // Switch to Player 2
            io.to(user.roomId).emit("current_player_updated", false); // Notify everyone that Player 2's turn starts
            console.log('Note list sent to room:', user.roomId);
        } else {
            console.log('User not found in any room');
        }
    };

    const startCountdown = (duration: number, player: boolean) => {
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
                io.to(roomId).emit("countdown_finished", { countdown: 0, player }); // Indicate which player's countdown finished
            }
        }, 1000);

        socket.on('stop_countdown', () => {
            clearInterval(interval);
            io.to(roomId).emit('countdown_finished', { countdown: 0, player });
        });
    };

    const handleScorePoints = (points: number) => {
        const user = users.find(user => user.sid === socket.id);
        if (user) {
            user.score += points; // Update score for the current player
            io.to(user.roomId).emit("update_scores", {
                player1Score: users[0].score, // Assuming user[0] is Player 1
                player2Score: users[1].score  // Assuming user[1] is Player 2
            });
        }
    };

    socket.on("send_noteslist", (data) => {
        sendNoteList(data);
    });

    socket.on("start_game", ({ duration }) => {
        const user = users.find(user => user.sid === socket.id);
        if (user) {
            user.score = 0; // Reset score at the beginning of the game
            io.to(user.roomId).emit("game_started", { duration });
            startCountdown(duration, true); // Start countdown for Player 1
        }
    });

    socket.on("score_points", (pointsEarned) => {
        handleScorePoints(pointsEarned); // Handle points scored by the player
    });

    // Handle disconnection of users
    socket.on("disconnect", () => {
        const userIndex = users.findIndex(user => user.sid === socket.id);
        if (userIndex !== -1) {
            users.splice(userIndex, 1); // Remove user from the list
            console.log(`User disconnected: ${socket.id}`);
        }
    });
}

export default gameHandler;