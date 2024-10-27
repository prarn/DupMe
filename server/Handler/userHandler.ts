import { Server, Socket } from "socket.io";
import { users } from "../dataStorage";

function userHandler(io: Server, socket: Socket) {
    const createUser = (data: { username: string }) => {
        const user = {
            sid: socket.id,
            username: data.username,
            roomId: "",
            instrument: "",
            score: 0,
            ready: false,
            P1: false,
        };

        users.push(user);
        console.log(`User created: ${data.username}`);
    };

    const updateInstrument = (data: {instrument: string}) => {
        const user = users.find(u => u.sid === socket.id);
        if (user) {
            user.instrument = data.instrument;
            console.log(`${user.sid} choose instrument: ${user.instrument}`);    
        }
    }

    socket.on("create_user", createUser);
    socket.on("update_instrument", updateInstrument);

    return () => {
        socket.off("create_user", createUser);
    };
}

export default userHandler;