import { Server, Socket } from "socket.io";
import { rooms, users } from "../dataStorage";

function userHandler(io: Server, socket: Socket) {
  const createUser = (data: { username: string; avatar: string }) => {
    const user = {
      sid: socket.id,
      username: data.username,
      avatar: data.avatar,
      roomId: "",
      instrument: "piano",
      score: 0,
      ready: false,
      P1: false,
    };

    users.push(user);
    console.log(`User created: ${data.username}`);
  };

  const checkUser = () => {
    const user = users.find((user) => user.sid === socket.id);
    if (user) {
      socket.emit('check_userCreated', user.username.trim() !== "");
      socket.emit('check_avatarChose', user.avatar.trim() !== "");
    }
  }

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

  const updateAvatar = (data) => {
    const me = users.find((user) => user.sid === socket.id);
    const opponent = users.find(
      (user) => user.roomId == me?.roomId && user.sid !== socket.id
    );

    let myAvatar = "";
    let opponentAvatar = "";

    if (me) {
      me.avatar = data;
      myAvatar = me.avatar;

      console.log(`${me.sid} choose instrument: ${me.avatar}`);
      socket.emit("update_myAvatar", {
        avatar: myAvatar,
      });
    }
    if (opponent) {
      // opponent still in the room
      const opponentSid = opponent.sid;
      opponentAvatar = opponent.avatar;

      // send my info to opponent
      io.to(opponentSid).emit("update_opponentAvatar", {
        avatar: myAvatar,
      });
      io.to(opponentSid).emit("update_myAvatar", {
        avatar: opponentAvatar,
      });
    }

    if (me && opponent) {
      // both still in the room
      // send opponent's info to me
      socket.emit("update_opponentAvatar", {
        avatar: opponentAvatar,
      });
    }
  };

  socket.on("create_user", createUser);
  socket.on("check_user", checkUser);
  socket.on("update_instrument", updateInstrument);
  socket.on("update_avatar", updateAvatar);

  return () => {
    socket.off("create_user", createUser);
    socket.off("update_instrument", updateInstrument);
    socket.off("update_avatar", updateAvatar);
  };
}

export default userHandler;
