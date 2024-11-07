import { useEffect, useState } from "react";
import socket from "../../socket";
import { useNavigate } from "react-router-dom";
// import "./Banner.css";

function Banner() {
    const [message, setMessage] = useState<string>();
    const [time, setTime] = useState<string>();
    const [cooldown, setCooldown] = useState(false);
    const [winner, setWinner] = useState(false);
    const navigate = useNavigate();

    const handleRestart = () => {
        socket.emit('restart_game');
        setWinner(false);
    }
    const handleLeaveRoom =() => {
        socket.emit('leave_room');
        navigate("/rooms");
    }

    useEffect(() => {
        socket.on("turn",(data: string) => {
            setMessage(data);
        });
        socket.on("time",(data: string) => {
            setTime(data);
        });
        socket.on("update_cooldown",(data: boolean) => {
            setCooldown(data);
        })
        socket.on("update_winner",(data: boolean) => {
            setWinner(data);
        })
        return () => {
            socket.off("turn");
            socket.off("time");
            socket.off("update_cooldown");
            socket.off("update_winner");
        }
    })

    return (
        <div className="">
            <button onClick={handleLeaveRoom}>Back to lobby</button>
            { cooldown && (
                <>
                    <div>{message}</div>
                    <div>{time}</div>
                </>
            )}

            { winner && (
                <>
                    <div>{message}</div>
                    <button onClick={handleRestart}>Restart</button>
                    <button onClick={handleLeaveRoom}>Back to lobby</button>
                </>
            )}
        </div>
    )
}

export default Banner;