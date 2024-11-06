import { useEffect, useState } from "react";
import socket from "../../socket";

function Cooldown() {
    const [message, setMessage] = useState<string>();
    const [time, setTime] = useState<string>();
    const [cooldown, setCooldown] = useState(false);

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
        return () => {
            socket.off("turn");
            socket.off("time");
            socket.off("update_cooldown");
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
        </div>
    )
}

export default Cooldown;