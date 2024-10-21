import React from "react";
import "./Lobby.css";

const Lobby: React.FC = () => {
  return (
    <div className="lobby-container">
      <div className="lobby-header">Lobby 2</div>
      <div className="lobby-players">0/2 Players</div>
      <button className="lobby-join">Join</button>
    </div>
  );
};

export default Lobby;
