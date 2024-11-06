import { useState } from "react";
import socket from "../../socket";
import "./UserModal.css";

function UserModal({
  setUserCreated,
}: {
  setUserCreated: (value: boolean) => void;
  setUsername: (value: string) => void;
}) {
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");

  const handleSubmit = () => {
    if (username.trim() !== "") {
      socket.emit("create_user", { username: username.trim(), avatar });
      setUserCreated(true);
      setUsername(username.trim());
    } else {
      alert("Please enter a valid username!");
    }
  };

  return (
    <>
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Name:</h2>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your name"
          />

          <h2>Choose your avatar</h2>
          <div className="avatar-selection">
            <img
              src="/avatar_image/avatar1.png"
              alt="avatar1"
              className={`avatar-image ${
                avatar === "avatar1" ? "active-avatar" : ""
              }`}
              onClick={() => setAvatar("avatar1")}
            />
            <img
              src="/avatar_image/avatar2.png"
              alt="avatar2"
              className={`avatar-image ${
                avatar === "avatar2" ? "active-avatar" : ""
              }`}
              onClick={() => setAvatar("avatar2")}
            />
            <img
              src="/avatar_image/avatar3.png"
              alt="avatar3"
              className={`avatar-image ${
                avatar === "avatar3" ? "active-avatar" : ""
              }`}
              onClick={() => setAvatar("avatar3")}
            />
            <img
              src="/avatar_image/avatar4.png"
              alt="avatar4"
              className={`avatar-image ${
                avatar === "avatar4" ? "active-avatar" : ""
              }`}
              onClick={() => setAvatar("avatar4")}
            />
          </div>

          <button className="submit-button" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </>
  );
}

export default UserModal;
