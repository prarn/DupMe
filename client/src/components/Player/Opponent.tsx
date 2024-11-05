import { useEffect, useState } from "react";
import socket from "../../socket";
import "./PlayerCard.css";

function Opponent() {
  const [name, setName] = useState<string>();
  const [score, setScore] = useState(0);
  const [myInstrument, setMyInstrument] = useState<string>();
  const [avatar, setAvatar] = useState<string>();

  useEffect(() => {
    socket.on("opponent", (data) => {
      setName(data.name);
      setScore(data.score);
      setMyInstrument(data.instrument);
      setAvatar(data.avatar);
    });

    socket.on("update_opponentInstrument", (data) => {
      setMyInstrument(data.instrument);
    });
  }, [socket]);

  return (
    <>
      <div className="player-card-container">
        <div className="name-avatar-score">
          <div className="name">{name}</div>
          <img
            className="avatar"
            src={`/avatar_image/${avatar}.png`}
            alt="Me"
          />
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

export default Opponent;
