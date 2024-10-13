import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";
import { ClientToServerEvents, ServerToClientEvents } from "../typings";

const app = express();
app.use(cors());

const server = createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on(
  "connection",
  (socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {
    // console.log(socket.id); //show socket id in console
    socket.on("clientMsg", (data) => {
      if(data.room === "" ) {
        io.sockets.emit("serverMsg", data);
      }else {
        socket.join(data.room);
        io.to(data.room).emit("serverMsg",data);
      }
      // io.sockets.emit("serverMsg", data); //Send to everyone including sender
      // socket.broadcast.emit("serverMsg", data); //Send to everyone except sender
    });
  }
);

server.listen(3000, '0.0.0.0', function(){
  console.log('listen on *:3000')
});
