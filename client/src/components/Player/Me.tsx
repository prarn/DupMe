import { useEffect, useState } from "react";
import socket from "../../socket";
import "./PlayerCard.css";

function Me() {
  const [name, setName] = useState<string>();
  const [score, setScore] = useState(0);
  const [myInstrument, setMyInstrument] = useState<string>();

  useEffect(() => {
    socket.on("me", (data) => {
      setName(data.name);
      setScore(data.score);
      setMyInstrument(data.instrument);
    });

    socket.on("update_myInstrument", (data) => {
      setMyInstrument(data.instrument);
    });
  }, [socket]);

  return (
    <>
      <div className="player-card-container">
        <div className="name-avatar-score">
          <div className="name">{name}</div>
          <img className="avatar" src="/Instruments/piano.png" alt="piano" />
          <div className="myscore">{score}</div>
          <h3>Score</h3>
        </div>

        <img
          className="instrument"
          src={`/Instruments/${myInstrument}.png`}
          alt={myInstrument}
        />
      </div>
    </>
  );
}

export default Me;
