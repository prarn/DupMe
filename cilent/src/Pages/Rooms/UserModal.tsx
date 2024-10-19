import { useState } from "react";
import socket from "../../socket";

function UserModal({ setUserCreated }: { setUserCreated: (value: boolean) => void }) {
    const [username, setUsername] = useState("");

    const handleSubmit = () => {
        if (username) {
            socket.emit("create_user", { username }); // Emit event to create the user
            setUserCreated(true); // Close the modal when user is created
        }
    };

    return (
        <>
            <div className="modal-content">
                <h2>Enter Your Name</h2>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your name"
                />
                <button onClick={handleSubmit}>Submit</button>
            </div>
        </>
    );
}

export default UserModal;
