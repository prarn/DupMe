import { Server, Socket } from "socket.io";
import { users, rooms } from "../dataStorage";

export function playerInfo(io: Server, socket: Socket) {
  const userIndex = users.findIndex((user) => user.sid === socket.id);
  if (userIndex !== -1) {
    const roomId = users[userIndex].roomId;
    const roomIndex = rooms.findIndex((room) => room.roomId === roomId);

    if (roomIndex !== -1) {
      return { userIndex: userIndex, roomId: roomId, roomIndex: roomIndex };
    } else {
      console.log("Room not found");
      return { userIndex: userIndex, roomId: roomId, roomIndex: -1 };
    }
  } else {
    console.log("User not found");
    return { userIndex: userIndex, roomId: "main", roomIndex: -1 };
  }
}

export function updatePlayerInRoom(
  io: Server,
  socket: Socket,
  roomId: string
): void {
  const playersInRoom = users.filter((user) => user.roomId === roomId);
  const roomIndex = rooms.findIndex((room) => room.roomId === roomId);
  if (roomIndex !== -1) {
    if (rooms[roomIndex].players !== playersInRoom.length) {
      rooms[roomIndex].players = playersInRoom.length;
      rooms[roomIndex].round = 0;
      io.to(roomId).emit("restart", { round: 0 });
      io.to(roomId).emit("turn", { message: "" });
      io.to(roomId).emit("time", { time: "" });

      playersInRoom.forEach((playerInRoom) => {
        playerInRoom.score = 0;
        playerInRoom.ready = false;
        playerInRoom.P1 = false;
      });
    }
  }

  const me = users.find(
    (user) => user.roomId === roomId && user.sid === socket.id
  );
  const opponent = users.find(
    (user) => user.roomId === roomId && user.sid !== socket.id
  );
  let myName = "";
  let myScore = 0;
  let myInstrument = "";
  let myAvatar = "";
  let opponentName = "";
  let opponentScore = 0;
  let opponentInstrument = "";
  let opponentAvatar = "";

  if (me) {
    // im still in the room
    myName = me.username;
    myScore = me.score;
    myInstrument = me.instrument;
    myAvatar = me.avatar;

    // send my info to me
    socket.emit("me", {
      name: myName,
      score: myScore,
      instrument: myInstrument,
      avatar: myAvatar,
    });
  }
  if (opponent) {
    // opponent still in the room
    const opponentSid = opponent.sid;
    opponentName = opponent.username;
    opponentScore = opponent.score;
    opponentInstrument = opponent.instrument;
    opponentAvatar = opponent.avatar;

    // send my info to opponent
    io.to(opponentSid).emit("opponent", {
      name: myName,
      score: myScore,
      instrument: myInstrument,
      avatar: myAvatar,
    });
    io.to(opponentSid).emit("me", {
      name: opponentName,
      score: opponentScore,
      instrument: opponentInstrument,
      avatar: opponentAvatar,
    });
  }
  if (me && opponent) {
    // both still in the room
    // send opponent's info to me
    socket.emit("opponent", {
      name: opponentName,
      score: opponentScore,
      instrument: opponentInstrument,
      avatar: opponentAvatar,
    });
  }
}
