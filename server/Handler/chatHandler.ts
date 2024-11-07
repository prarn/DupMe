// server/Handler/chatHandler.ts

import { Server, Socket } from "socket.io";
import { users } from "../dataStorage";

function chatHandler(io: Server, socket: Socket) {
  const sendMessage = (data: { user: string; message: string }) => {
    const user = users.find(user => user.sid === socket.id);
    if(user) io.emit("receive_message", { user: user.username, message: data.message });
  };

  socket.on("send_message", sendMessage);

  return () => {
    socket.off("send_message", sendMessage);
  };
}

export default chatHandler;