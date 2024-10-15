import { useEffect, useState } from "react";
import socket from "./socket";
import { useNavigate } from "react-router-dom";

function Rooms() {
    const navigate = useNavigate();
    
    const [rooms, setRooms] = useState<{ roomId: string, players: number }[]>([]);

    const handleCreateRoom = () => {
        socket.emit('create_room')
        
    }
    useEffect(() => {
        socket.on('update_rooms', (data) => {
            setRooms(data);
        })
        return () => {
            socket.off('update_rooms');
        }
    },[])

    const handleJoin = (item: string) => {
        console.log(`Want to join ${item}`)
        socket.emit('join_room', item);
        navigate('/piano')
    }

    return (
        <div>
            <button onClick={handleCreateRoom}>Create Room</button>
            {rooms.map((item) => (
                <div
                    key={item.roomId}
                    onClick={() => {handleJoin(item.roomId);}}
                >
                    <div>{item.roomId}</div>
                    <div>{item.players} players</div>
                </div>
            ))}
        </div>
    )
}
export default Rooms;