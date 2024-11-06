import { useState } from "react";
import socket from "../../socket";
import "./UserModal.css";

function UserModal({
  setUserCreated,
  setUsername,
}: {
  setUserCreated: (value: boolean) => void;
  setUsername: (value: string) => void;
}) {
  const [localUsername, setLocalUsername] = useState("");

  const handleSubmit = () => {
    if (localUsername.trim() !== "") {
      socket.emit("create_user", { username: localUsername.trim() });
      setUserCreated(true);
      setUsername(localUsername.trim());
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
            value={localUsername}
            onChange={(e) => setLocalUsername(e.target.value)}
            placeholder="Enter your name"
          />
          <button className="submit-button" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </>
  );
}

export default UserModal;
