import React from "react";
import "./Lobby.css";

interface LobbyProps {
  roomId: string;
  players: number;
  handleJoin: (roomId: string) => void; // Prop for the join functionality
}

const Lobby: React.FC<LobbyProps> = ({ roomId, players, handleJoin }) => {
  return (
    <div className="lobby-container">
      <div className="lobby-header">Lobby {roomId}</div>
      <div className="lobby-players">{players}/2 Players</div>
      <button className="lobby-join" onClick={() => handleJoin(roomId)}>
        Join
      </button>
    </div>
  );
};

export default Lobby;
