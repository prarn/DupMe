import { Server, Socket } from "socket.io";
import { rooms, users } from "../dataStorage";

function userHandler(io: Server, socket: Socket) {
  const createUser = (data: { username: string; avatar?: string }) => {
    const user = {
      sid: socket.id,
      username: data.username,
      avatar: data.avatar || "", // Default to empty string if avatar is not provided
      roomId: "",
      instrument: "",
      score: 0,
      ready: false,
      P1: false,
    };

    users.push(user);
    console.log(`User created: ${data.username}`);
  };

  const updateInstrument = (data: { instrument: string }) => {
    const me = users.find((user) => user.sid === socket.id);
    if (me) {
      me.instrument = data.instrument;
      console.log(`${me.sid} chose instrument: ${me.instrument}`);

      // Notify the user about their instrument
      socket.emit("update_myInstrument", {
        instrument: me.instrument,
      });

      // Find the opponent in the same room
      const opponent = users.find(
        (user) => user.roomId === me.roomId && user.sid !== socket.id
      );

      if (opponent) {
        // Notify the opponent about my instrument
        io.to(opponent.sid).emit("update_opponentInstrument", {
          instrument: me.instrument,
        });

        // Notify me about the opponent's instrument
        socket.emit("update_opponentInstrument", {
          instrument: opponent.instrument,
        });
      }
    }
  };

  const updateAvatar = (data: { avatar: string }) => {
    const me = users.find((user) => user.sid === socket.id);
    if (me) {
      me.avatar = data.avatar;
      console.log(`${me.sid} chose avatar: ${me.avatar}`);

      // Notify the user about their avatar
      socket.emit("update_myAvatar", {
        avatar: me.avatar,
      });

      // Find the opponent in the same room
      const opponent = users.find(
        (user) => user.roomId === me.roomId && user.sid !== socket.id
      );

      if (opponent) {
        // Notify the opponent about my avatar
        io.to(opponent.sid).emit("update_opponentAvatar", {
          avatar: me.avatar,
        });

        // Notify me about the opponent's avatar
        socket.emit("update_opponentAvatar", {
          avatar: opponent.avatar,
        });
      }
    }
  };

  socket.on("create_user", createUser);
  socket.on("update_instrument", updateInstrument);
  socket.on("update_avatar", updateAvatar);

  return () => {
    socket.off("create_user", createUser);
    socket.off("update_instrument", updateInstrument);
    socket.off("update_avatar", updateAvatar);
  };
}

export default userHandler;

