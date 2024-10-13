import { FormEvent, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import { ServerToClientEvents, ClientToServerEvents } from "../../typings";

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  "http://localhost:3000/"
);

// socket.on("connect",() => {
//   console.log(`Cleint ${socket.id}`);
// }) //if connect show socket id

function App() {
  const [room, setRoom] = useState("");
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // console.log(msg + room);
    socket.emit("clientMsg", { msg, room });
    setMsg("");
    setRoom("");
  };

  useEffect(() => {
    socket.on("serverMsg", (data) => {
      setMessages([...messages, data.msg]);
    });
  }, [socket, messages]);
  console.log(messages);
  return (
    <div className="App">
      <div>
        <h1>Messages</h1>
        {messages.map((msg, i) => (
          <p key={i}>{msg}</p>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter room key"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter message"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        />
        <button>Send Message</button>
      </form>
    </div>
  );
}

export default App;
