import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

import gameHandler from "./Handler/gameHandler";

io.on( "connection", (socket) => {
    console.log(`User connected: ${socket.id}`)
    gameHandler(io,socket)
  }
);

server.listen(3000, '0.0.0.0', function(){
  console.log('listen on PORT:3000')
});
