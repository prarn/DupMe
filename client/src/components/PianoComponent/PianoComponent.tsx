import { useEffect, useState } from "react";
import socket from "../../socket";
import "./PianoComponent.css";

function PianoComponent() {
  const notes = ["C", "D", "E", "F", "G", "A", "B"];
  const [noteList, setNoteList] = useState<{ id: number; note: string }[]>([]);
  const [noteList_Received, setNoteList_Received] = useState<{ id: number; note: string }[]>([]);

  const [countdown, setCountdown] = useState(10);
  const [currentPlayer, setCurrentPlayer] = useState(true);
  const [isready, setIsReady] = useState(false);

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

  const handleReady = () => {
    socket.emit("ready");
    setIsReady(true);
  }

  const handleStart = () => {
    setCountdown(10);
    setNoteList([]);
    setNoteList_Received([]);
    socket.emit("start_game"); // Start game and initialize scores
  };

  const handleSubmit = () => {
    if (currentPlayer) {
      // Player 1's turn
      if (noteList.length > 0) {
        socket.emit("send_noteslist", noteList); // Send notes to server
        socket.emit("end_create");
        setNoteList([]);
      }
    } else {
      // Player 2's turn
      handleSecondPlayerSubmit(); // Process Player 2's submission
      socket.emit("end_follow");
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
    setNoteList_Received([]); // Reset the note list for the next round
  };
  
  //See received note list in console
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

  //Countdown update + Current player update
  useEffect(() => {
    socket.on("countdown_update", (data) => {
      setCountdown(data.countdown);
    });

    socket.on("countdown_finished", () => {
      setCountdown(0);
      handleSubmit();
    });

    socket.on("current_player_updated", (isPlayer1) => {
      setCurrentPlayer(isPlayer1); // Update the current player state
      if (!isPlayer1) setCountdown(20); // Start 20 seconds for Player 2
    });
    
    socket.on("start_create",handleStart);

    return () => {
      socket.off("countdown_update");
      socket.off("countdown_finished");
      socket.off("current_player_updated");
      socket.off("start_create");
    };
  });


  return (
    <>
      <div className="status">
        <button className="start" onClick={handleReady} disabled={isready}>
          Ready
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
