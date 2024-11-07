// Rooms.tsx

import { useEffect, useState } from "react";
import socket from "../../socket";
import { useNavigate } from "react-router-dom";
import UserModal from "../../components/UserModal/UserModal";
import "./Rooms.css";
import { Link } from "react-router-dom";
import Lobby from "../../components/Lobby/Lobby";

function Rooms() {
  const navigate = useNavigate();
  const [userCreated, setUserCreated] = useState(false);
  const [avatarChose, setAvatarChose] = useState(false);
  const [rooms, setRooms] = useState<{ roomId: string; players: number }[]>([]);
  const [username, setUsername] = useState("");
  const [messages, setMessages] = useState<{ user: string; message: string }[]>([]);
  const [messageInput, setMessageInput] = useState("");

  useEffect(() => {
    socket.emit("check_user");
    socket.on('check_userCreated', (data) => {
      setUserCreated(data);
    });
    socket.on('check_avatarChose',(data) => {
      setAvatarChose(data);
    });
    return () => {
      socket.off('check_userCreated');
      socket.off('check_avatarChose');
    }
  });

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
  }, []);

  // Handle when players join the room
  const handleJoin = (roomId: string) => {
    if (userCreated && avatarChose) {
      console.log(`Joining room ${roomId}`);
      socket.emit("join_room", roomId);
      navigate("/game");
    } else if (!userCreated) {
      alert("Please enter your username!");
    } else if (!avatarChose) {
      alert("Please select your avatar!");
    } else {
      alert("Please enter your username and select your avatar!");
    }
  };

  // Chat functionality
  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  const handleSendMessage = () => {
    if (messageInput.trim() !== "") {
      const messageData = {
        user: username,
        message: messageInput,
      };
      socket.emit("send_message", messageData);
      setMessageInput("");
    }
  };

  return (
    <div className="main-container">
      {/* Header with Create Lobby and Main Menu buttons */}
      <div className="header">
        <div className="create-lobby" onClick={handleCreateRoom}>
          Create Lobby
        </div>
      </div>

      {/* Conditionally show 'No Lobby' banner only if there are no rooms */}
      {rooms.length === 0 && <div className="no-lobby-banner">No Lobby</div>}

      {/* Only render UserModal if user is not created */}
      {!userCreated && (
        <div className="user-modal">
          <UserModal setUserCreated={setUserCreated} setAvatarChose={setAvatarChose} setUsername={setUsername}/>
        </div>
      )}

      <div className="lobby-slot">
        {userCreated &&
          rooms.map((item) => (
            <Lobby
              key={item.roomId}
              roomId={item.roomId}
              players={item.players}
              handleJoin={handleJoin}
            />
          ))}
      </div>

      <div className="main-menu">
          <Link to="/" className="main-menu-link">
            Main Menu
          </Link>
        </div>

      {/* Chat Box */}
      <div className="chat-container">
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div key={index} className="chat-message">
              <strong>{msg.user}:</strong> {msg.message}
            </div>
          ))}
        </div>
        <div className="chat-input">
          <input
            type="text"
            className="message-input"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Type a message"
          />
          <div className="send-button" onClick={handleSendMessage}>
            Send
          </div>
        </div>
      </div>
    </div>
  );
}

export default Rooms;