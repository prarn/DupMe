// Opponent.tsx

import { useEffect, useState } from "react";
import socket from "../../socket";
import "./PlayerCard.css";

function Opponent() {
  const [name, setName] = useState<string>();
  const [score, setScore] = useState(0);
  // const [avatar, setAvatar] = useState<string>();
  const [myInstrument, setMyInstrument] = useState<string>();

  useEffect(() => {
    socket.on("opponent", (data) => {
      setName(data.username);
      setScore(data.score);
      // setAvatar(data.avatar);
      setMyInstrument(data.instrument);
    });

    socket.on("score_updated", (data) => {
      if (data.playerId === socket.id) {
          setScore(data.score); // Update score for the current player
      }
    });

    return () => {
      socket.off("opponent");
      socket.off("score_updated"); // Clean up listener
    };
  });

  return (
    <>
      <div className="player-card-container">
        <div className="name-avatar-score">
          <div className="name">{name}</div>
          <img className="avatar" src="/Instruments/piano.png" alt="piano" />
          {/* <img className="avatar" src={avatar} alt="Me" /> */}
          <div className="myscore">{score}</div>
          <h3>Score</h3>
        </div>
        <img className="instrument" src="/Instruments/piano.png" alt="piano" />
        <img
            src={myInstrument}
            alt="myInstrument"
            className="instrument-icon"
          />
      </div>
    </>
  );
}

export default Opponent;
