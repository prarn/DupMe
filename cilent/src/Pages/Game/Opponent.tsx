import React, { useEffect, useState } from "react";
import socket from "../../socket";
import "./PlayerCard.css";

function Opponent() {
  const [name, setName] = useState<string>();
  const [avatar, setAvatar] = useState<string>();
  const [score, setScore] = useState(0);
  const [opponentInstrument, setopponentInstrument] = useState<string>();

  useEffect(() => {
    socket.on("opponent", (data) => {
      setName(data.name);
      setAvatar(data.avatar);
      setScore(data.score);
    });
  }, [socket]);

  return (
    <>
      <div className="player-card-container">
        <div className="name-avatar-score">
          <div className="name">{name}</div>
          <img className="avatar" src="/Instruments/piano.png" alt="piano" />
          {/* <img className="avatar" src={avatar} alt="Opponent" /> */}
          <div className="opponentscore">{score}</div>
          <h3>Score</h3>
        </div>
        
        <img className="instrument" src="/Instruments/piano.png" alt="piano" />
        {/* <img
            src={opponentInstrument}
            alt="opponentInstrument"
            className="instrument-icon"
          /> */}
      </div>
    </>
  );
}

export default Opponent;
