import { useEffect, useState } from "react";
import socket from "../../socket";
import { useNavigate } from "react-router-dom";
import "./Banner.css";

function Banner() {
  const [message, setMessage] = useState<string>();
  const [time, setTime] = useState<string>();
  const [cooldown, setCooldown] = useState(false);
  const [winner, setWinner] = useState(false);
  const navigate = useNavigate();

  const handleRestart = () => {
    socket.emit("restart_game");
    setWinner(false);
  };
  const handleLeaveRoom = () => {
    socket.emit("leave_room");
    navigate("/rooms");
  };

  useEffect(() => {
    socket.on("turn", (data: string) => {
      setMessage(data);
    });
    socket.on("time", (data: string) => {
      setTime(data);
    });
    socket.on("update_cooldown", (data: boolean) => {
      setCooldown(data);
    });
    socket.on("update_winner", (data: boolean) => {
      setWinner(data);
    });
    return () => {
      socket.off("turn");
      socket.off("time");
      socket.off("update_cooldown");
      socket.off("update_winner");
    };
  });

  return (
    <div className="">
      <button className="btl-button" onClick={handleLeaveRoom}>
        Back to lobby
      </button>
      {cooldown && (
        <>
          <div className="ready-set-go">
            <div className="rsg-message">{message}</div>
            <div className="rsg-time">{time}</div>
          </div>
        </>
      )}

      {winner && (
        <>
          <div className="winner">
            <div className="winner-message">{message}</div>
            <button className="re-button" onClick={handleRestart}>
              Restart
            </button>
            <button className="btl-button" onClick={handleLeaveRoom}>
              Back to lobby
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Banner;
