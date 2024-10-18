import { Server, Socket } from "socket.io";
import { users } from "../dataStorage";

function userHandler(io: Server, socket: Socket) {
    const createUser = (data: { username: string }) => {
        const user = {
            sid: socket.id,
            username: data.username,
            roomId: "",
            score: 0,
            ready: false,
            P1: false,
        };

        users.push(user);
        console.log(`User created: ${data.username}`);
    };

    socket.on("create_user", createUser);

    return () => {
        socket.off("create_user", createUser);
    };
}

export default userHandler;