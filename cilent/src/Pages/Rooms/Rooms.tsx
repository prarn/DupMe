import { useEffect, useState } from "react";
import socket from "../../socket";
import { useNavigate } from "react-router-dom";
import UserModal from "./UserModal";

function Rooms() {
    const navigate = useNavigate();
    const [userCreated, setUserCreated] = useState(false); // Tracks if user is created
    const [rooms, setRooms] = useState<{ roomId: string, players: number }[]>([]);

    // Handle when create room button is clicked
    const handleCreateRoom = () => {
        if (userCreated) {
            socket.emit('create_room');
        } else {
            alert("Please enter your username first!");
        }
    }

    // Update rooms and alert when full
    useEffect(() => {
        socket.on('update_rooms', (data) => {
            setRooms(data);
        })
        socket.on('alert_roomfull',() => {
            alert("Room is full!");
        })
        return () => {
            socket.off('update_rooms');
            socket.off('alert_roomfull');
        }
    },[])

    // Handle when players join the room
    const handleJoin = (item: string) => {
        if (userCreated) {
            console.log(`Want to join ${item}`);
            socket.emit('join_room', item);
            navigate('/piano');
        } else {
            alert("Please enter your username first!");
        }
    }

    return (
        <div>
            {!userCreated && (
                <UserModal setUserCreated={setUserCreated} />
            )}
            
            {userCreated && (
                <>
                    <button onClick={handleCreateRoom}>Create Room</button>
                    {rooms.map((item) => (
                        <div
                            key={item.roomId}
                            onClick={() => { handleJoin(item.roomId); }}
                        >
                            <div>{item.roomId}</div>
                            <div>{item.players} players</div>
                        </div>
                    ))}
                </>
            )}
        </div>
    )
}
export default Rooms;