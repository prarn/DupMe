import { useEffect, useState } from "react";
import socket from "../../socket";
import "./Banner.css";

function Cooldown() {
    const [message, setMessage] = useState<string>();
    const [time, setTime] = useState<string>();
    const [cooldown, setCooldown] = useState(false);
    const [winner, setWinner] = useState(false);

    const handleRestart = () => {
        socket.emit('restart_game');
        setWinner(false);
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
        <div className="cooldown-banner">
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
                </>
            )}
        </div>
    )
}

export default Cooldown;