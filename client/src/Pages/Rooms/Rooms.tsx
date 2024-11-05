import { useEffect, useState } from "react";
import socket from "../../socket";
import { useNavigate } from "react-router-dom";
import UserModal from "../../components/UserModal/UserModal";
import "./Rooms.css";
import { Link } from "react-router-dom";
import Lobby from "../../components/Lobby/Lobby";

function Rooms() {
  const navigate = useNavigate();
  const [userCreated, setUserCreated] = useState(false); // Tracks if user is created
  const [rooms, setRooms] = useState<{ roomId: string; players: number }[]>([]);

  // Handle when create room button is clicked
  const handleCreateRoom = () => {
    if (userCreated) {
      socket.emit("create_room");
    } else {
      alert("Please enter your username first!");
    }
  };

  // Update rooms and alert when full
  useEffect(() => {
    socket.emit("request_rooms");

    socket.on("update_rooms", (data) => {
      setRooms(data);
    });

    socket.on("alert_roomfull", () => {
      alert("Room slot is full!");
    });

    return () => {
      socket.off("update_rooms");
      socket.off("alert_roomfull");
    };
  });

  // Handle when players join the room
  const handleJoin = (roomId: string) => {
    if (userCreated) {
      console.log(`Joining room ${roomId}`);
      socket.emit("join_room", roomId);
      navigate("/game");
    } else {
      alert("Please enter your username first!");
    }
  };

  return (
    <div className="main-container">
      <div className="header">
        <img
          onClick={handleCreateRoom}
          className="createlobby-button"
          src="/rooms_image/createlobby.png"
          alt="createlobby button"
        />
      </div>

      {/* Conditionally show 'No Lobby' banner only if there are no rooms */}
      {rooms.length === 0 && <div className="no-lobby-banner">No Lobby</div>}

      {/* Only render UserModal if user is not created */}
      {!userCreated && (
        <div className="user-modal">
          <UserModal setUserCreated={setUserCreated} />
        </div>
      )}

      <div className="lobby-slot">
        {userCreated &&
          rooms.map((item) => (
            <Lobby
              roomId={item.roomId}
              players={item.players}
              handleJoin={handleJoin}
            />
          ))}
      </div>

      <div className="mainmenu-button">
        <Link to="/">
          <img
            className="mainmenu-button"
            src="/MainMenu.png"
            alt="mainmenu button"
          />
        </Link>
      </div>
    </div>
  );
}

export default Rooms;
