// Piano.tsx

import { useEffect, useState } from "react";
import socket from "../../socket";
import "./Piano.css";

function Piano() {
  const notes = ["C", "D", "E", "F", "G", "A", "B"];
  const [noteList, setNoteList] = useState<{ id: number; note: string }[]>([]);
  const [noteList_Received, setNoteList_Received] = useState<{ id: number; note: string }[]>([]);
  const [countdown, setCountdown] = useState(10);
  
  const [currentPlayer, setCurrentPlayer] = useState(true); // State to manage current player
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);

  const handleClickKeys = (item: string) => {
    if (noteList.length < 5) {
      setNoteList((prevNoteList) => {
        const newNote = { id: noteList.length, note: item };
        const newNoteList = [...prevNoteList, newNote];
        console.log(newNote);
        return newNoteList;
      });
      playSound(`/notes/piano/${item.toLowerCase()}.mp3`);
    }
  };

  const playSound = (soundFile: string) => {
    const audio = new Audio(soundFile);
    audio.volume = 0.2;
    audio.play();
  };

  const handleSubmit = () => {
    if (countdown > 0) {
      socket.emit("stop_countdown");
    }
    if (noteList.length > 0) {
      socket.emit("send_noteslist", noteList);
      setNoteList([]);
    }

    // After submitting, update the current player
    const newPlayerState = !currentPlayer; // Toggle between true and false
    setCurrentPlayer(newPlayerState);
    socket.emit("update_current_player", newPlayerState); // Emit the new current player state
  };

  const handleReset = () => {
    setNoteList([]);
  };

  const handleCreate = () => {
    setCountdown(10); // Reset the countdown
    setNoteList([]); // Clear the local note list
    setNoteList_Received([]); // Clear received notes
    socket.emit("start_game", { duration: 10 }); // Emit restart signal to backend
  };

  useEffect(() => {
    socket.on("countdown_update", (data) => {
      setCountdown(data.countdown);
    });

    socket.on("countdown_finished", () => {
      setCountdown(0);
      handleSubmit();
    });

    socket.on("current_player_updated", (player) => {
      setCurrentPlayer(player); // Update the current player based on the emitted event
    });

    return () => {
      socket.off("countdown_update");
      socket.off("countdown_finished");
      socket.off("current_player_updated"); // Clean up listener
    };
  }, []);

  useEffect(() => {
    const receiveNotes = (data: { id: number; note: string }[]) => {
      setNoteList_Received(data);
      console.log("Received notes:", data);
    };

    socket.on("receive_noteslist", receiveNotes);

    return () => {
      socket.off("receive_noteslist", receiveNotes);
    };
  }, [noteList_Received]);

  useEffect(() => {
    console.log(noteList);
  }, [noteList]);

  return (
    <>
      <div className="top">
        <button className="start" onClick={handleCreate}>Start</button>
        <p></p>
      </div>

      <div className="game-container">
        <div className="header">
          <div className="user user1">
            <div className="user-and-score">
              <h2>User 1</h2>
              <div className="score">{player1Score}</div>
              <h3>Score</h3>
            </div>
            <img src="/Instruments/piano.png" alt="piano" />
          </div>

          <div className="time">
            <div className="timer-background">
              <img src="/gamepage_image/Rectangle 18.png" alt="timer-banner" />
              <p className="time-text">Time</p>
              <div className="timer">{countdown}</div>
            </div>
            <div className="turn-pointer">
              {currentPlayer ? (
                <img src="/gamepage_image/turn-left.png" alt="turn-left" />
              ) : (
                <img src="/gamepage_image/turn-right.png" alt="turn-right" />
              )}
            </div>
          </div>

          <div className="user user2">
            <img src="/Instruments/trumpet.png" alt="trumpet" />
            <div className="user-and-score">
              <h2>User 2</h2>
              <div className="score">{player2Score}</div>
              <h3>Score</h3>
            </div>
          </div>
        </div>

        <div className="gameplay">
          <div className="sequence-boxes">
            {noteList.map((item) => (
              <div key={item.id} className={`sequence note`}>
                {item.note}
              </div>
            ))}
            {/* Empty boxes for remaining sequence slots (if any) */}
            {Array(5 - noteList.length)
              .fill("")
              .map((_, index) => (
                <div key={index + noteList.length} className="sequence"></div>
              ))}
          </div>

          <button className="submit" onClick={handleSubmit}>
            Submit
          </button>
        </div>

        <div className="controls">
          <button className="replay">
            Replay
            <img src="/gamepage_image/speaker.png" alt="speaker" />
          </button>
          <div className="piano-keys">
            {notes.map((item) => (
              <button
                key={item}
                className="white-key"
                onClick={() => {
                  handleClickKeys(item);
                }}
              >
                {item}
              </button>
            ))}
            <p></p>
          </div>

          <button className="reset" onClick={handleReset}>
            Reset
          </button>
        </div>
      </div>
    </>
  );
}

export default Piano;





