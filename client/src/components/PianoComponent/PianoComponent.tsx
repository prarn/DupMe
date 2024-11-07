import { useEffect, useState } from "react";
import socket from "../../socket";
import "./PianoComponent.css";

function PianoComponent() {
  const notes = ["C", "D", "E", "F", "G", "A", "B"];
  const [noteList, setNoteList] = useState<{ id: number; note: string }[]>([]);
  const [noteList_Received, setNoteList_Received] = useState<{ id: number; note: string }[]>([]);

  const [countdown, setCountdown] = useState(10);
  const [isCreator, setIsCreator] = useState(false);
  const [isFollower, setIsFollower] = useState(false);

  const [isReady, setIsReady] = useState(false);
  const [waitingMessage, setWaitingMessage] = useState<string>();

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

  const handleReplay = async () => {
    for (let i = 0; i < noteList_Received.length; i++) {
      const note = noteList_Received[i].note;
      playSound(`/notes/piano/${note.toLowerCase()}.mp3`);
      await new Promise((resolve) => setTimeout(resolve, 500)); // 500ms delay between notes
    }
  };  

  const handleReady = () => {
    socket.emit("ready");
    setIsReady(true);
  }

  const handleStart = () => {
    setNoteList([]);
    setNoteList_Received([]);
    setWaitingMessage("");
    socket.emit("start_game"); // Start game and initialize scores
  };

  const handleSubmit = () => {
    if (isCreator) {
      // Creator's turn
      if (noteList.length > 0) socket.emit("send_noteslist", noteList); // Send notes to server
      socket.emit("end_create");
      setNoteList([]);
      setIsCreator(false);
      console.log('End Creating');
    } else if (isFollower) {
      // Follower's turn
      const pointsEarned = noteList.reduce((points, note, index) => {
        return note.note === noteList_Received[index]?.note ? points + 1 : points;
      }, 0);
      socket.emit("end_follow", pointsEarned); // Send points earned to server
      setNoteList([]); // Reset the note list for the next round
      setNoteList_Received([]); // Reset the note list for the next round
      setIsFollower(false);
      console.log('End following');
    }else {
      console.log("Submit not working right now");
    }
  };

  const handleReset = () => {
    setNoteList([]);
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

  //Socket form server
  useEffect(() => {
    socket.on("countdown_update", (data) => {
      setCountdown(data.countdown);
    });

    socket.on("countdown_finished", () => {
      setCountdown(0);
      if (isCreator || isFollower) handleSubmit();
    });
    
    socket.on("start_game", handleStart);
    socket.on("waiting_message", (data) => {
      setWaitingMessage(data);
    });
    socket.on("start_create", () => {
      setIsCreator(true);
      console.log('Creating');
    })
    socket.on("start_follow", () => {
      setIsFollower(true);
      handleReplay();
      console.log('Following');
    })
    socket.on("restart", () => {
      setIsReady(false);
      setCountdown(10);
    })

    return () => {
      socket.off("countdown_update");
      socket.off("countdown_finished");
      socket.off("current_player_updated");
      socket.off("start_game");
      socket.off("start_create");
      socket.off("start_follow");
      socket.off("restart");
    };
  });


  return (
    <>
      <div className="status">
        <button 
          className={isReady ? "button-ready-clicked":"start"}
          onClick={handleReady} 
          disabled={isReady}>
          Ready
        </button>
        <div>{waitingMessage}</div>

        <div className="time">
          <div className="timer-background">
            <img src="/gamepage_image/Rectangle 18.png" alt="timer-banner" />
            <p className="time-text">Time</p>
            <div className="timer">{countdown}</div>
          </div>
          <div className="turn-pointer">
            {(isCreator || isFollower) === true ? (
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

        <button 
          className="submit" 
          onClick={() => {socket.emit("stop_countdown");}}>
          Submit
        </button>
      </div>

      <div className="controls">
        <button className="replay" onClick={handleReplay}>
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
