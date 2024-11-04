import React, { useEffect, useState } from "react";
import socket from "../../socket";
import "./PianoComponent.css";

function PianoComponent() {
  const notes = ["C", "D", "E", "F", "G", "A", "B"];
  const [noteList, setNoteList] = useState<{ id: number; note: string }[]>([]);
  const [noteList_Received, setNoteList_Received] = useState<
    { id: number; note: string }[]
  >([]);

  const [isReady, setIsReady] = useState(false); // data from the server
  const [opponentReady, setOpponentReady] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [currentPlayer, setCurrentPlayer] = useState(true);

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

  const handleCreate = () => {
    setCountdown(10);
    setNoteList([]);
    setNoteList_Received([]);
    socket.emit("start_game", { duration: 10 }); // Start game and initialize scores
  };

  const handleSubmit = () => {
    if (currentPlayer) {
      // Player 1's turn
      if (noteList.length > 0) {
        socket.emit("send_noteslist", noteList); // Send notes to server
        setNoteList([]);
      }
    } else {
      // Player 2's turn
      handleSecondPlayerSubmit(); // Process Player 2's submission
      // setCountdown(0); // Stop countdown for Player 2
    }
  };

  const handleReset = () => {
    setNoteList([]);
  };

  const handleSecondPlayerSubmit = () => {
    const pointsEarned = noteList.reduce((points, note, index) => {
      return note.note === noteList_Received[index]?.note ? points + 1 : points;
    }, 0);
    socket.emit("score_points", pointsEarned); // Send points earned to server
    setNoteList([]); // Reset the note list for the next round
  };

  useEffect(() => {
    const receiveNotes = (data: { id: number; note: string }[]) => {
      setNoteList_Received(data);
      console.log("Received notes:", data);
    };

    socket.on("receive_noteslist", receiveNotes);

    return () => {
      socket.off("receive_noteslist", receiveNotes);
    };
  }, []);

  useEffect(() => {
    socket.on("countdown_update", (data) => {
      setCountdown(data.countdown);
    });

    socket.on("countdown_finished", () => {
      setCountdown(0);
      if (currentPlayer) {
        handleSubmit(); // Ends Player 1’s turn
      } else {
        handleSecondPlayerSubmit(); // Calculate and end Player 2’s turn
      }
    });

    socket.on("current_player_updated", (isPlayer1) => {
      setCurrentPlayer(isPlayer1); // Update the current player state
      if (!isPlayer1) setCountdown(20); // Start 20 seconds for Player 2
    });

    return () => {
      socket.off("countdown_update");
      socket.off("countdown_finished");
      socket.off("current_player_updated");
    };
  });

  return (
    <>
      <div className="status">
        <button className="start" onClick={handleCreate}>
          Start
        </button>

        <div className="time">
          <div className="timer-background">
            <img src="/gamepage_image/Rectangle 18.png" alt="timer-banner" />
            <p className="time-text">Time</p>
            <div className="timer">{countdown}</div>
          </div>
          <div className="turn-pointer">
            {currentPlayer === true ? (
              <img src="/gamepage_image/turn-left.png" alt="turn-left" />
            ) : (
              <img src="/gamepage_image/turn-right.png" alt="turn-right" />
            )}
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
        </div>

        <button className="reset" onClick={handleReset}>
          Reset
        </button>
      </div>
    </>
  );
}

export default PianoComponent;
