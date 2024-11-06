// server/Handler/chatHandler.ts

import { Server, Socket } from "socket.io";

function chatHandler(io: Server, socket: Socket) {
  const sendMessage = (data: { user: string; message: string }) => {
    io.emit("receive_message", data);
  };

  socket.on("send_message", sendMessage);

  return () => {
    socket.off("send_message", sendMessage);
  };
}

export default chatHandler;