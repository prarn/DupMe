import React, { useEffect, useState } from "react";
import socket from "../../socket";
import "./PlayerCard.css";

function Me() {
  const [name, setName] = useState<string>();
  const [avatar, setAvatar] = useState<string>();
  const [score, setScore] = useState(0);
  const [myInstrument, setMyInstrument] = useState<string>();

  useEffect(() => {
    socket.on("me", (data) => {
      setName(data.username);
      setAvatar(data.avatar);
    });
  }, [socket]);

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
        {/* <img
            src={myInstrument}
            alt="myInstrument"
            className="instrument-icon"
          /> */}
      </div>
    </>
  );
}

export default Me;
