import { Server, Socket } from "socket.io";
import { rooms, users } from "../dataStorage";

function userHandler(io: Server, socket: Socket) {
  const createUser = (data: { username: string }) => {
    const user = {
      sid: socket.id,
      username: data.username,
      roomId: "",
      instrument: "piano",
      score: 0,
      ready: false,
      P1: false,
    };

    users.push(user);
    console.log(`User created: ${data.username}`);
  };

  const updateInstrument = (data) => {
    const me = users.find((user) => user.sid === socket.id);
    const opponent = users.find(
      (user) => user.roomId == me?.roomId && user.sid !== socket.id
    );

    let myInstrument = "";
    let opponentInstrument = "";

    if (me) {
      me.instrument = data;
      myInstrument = me.instrument;

      console.log(`${me.sid} choose instrument: ${me.instrument}`);
      socket.emit("update_myInstrument", {
        instrument: myInstrument,
      });
    }
    if (opponent) {
      // opponent still in the room
      const opponentSid = opponent.sid;
      opponentInstrument = opponent.instrument;

      // send my info to opponent
      io.to(opponentSid).emit("update_opponentInstrument", {
        instrument: myInstrument,
      });
      io.to(opponentSid).emit("update_myInstrument", {
        instrument: opponentInstrument,
      });
    }

    if (me && opponent) {
      // both still in the room
      // send opponent's info to me
      socket.emit("update_opponentInstrument", {
        instrument: opponentInstrument,
      });
    }
  };

  socket.on("create_user", createUser);
  socket.on("update_instrument", updateInstrument);

  return () => {
    socket.off("create_user", createUser);
  };
}

export default userHandler;
