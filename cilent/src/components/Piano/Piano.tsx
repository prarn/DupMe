import React, { useEffect, useState } from "react";
import socket from "../../socket";
import { useNavigate } from "react-router-dom";
import "./Piano.css";

// Define the type for the note map
interface Note {
  note: string;
  sound: string;
}

const Piano: React.FC = () => {
  const [sequence, setSequence] = useState<string[]>([]);
  const [player1Sequence, setPlayer1Sequence] = useState<string[]>([]);
  const [player2Sequence, setPlayer2Sequence] = useState<string[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<number>(1);
  const [player1Score, setPlayer1Score] = useState<number>(0);
  const [player2Score, setPlayer2Score] = useState<number>(0);
  const [isCreating, setIsCreating] = useState<boolean>(true);

  // Map key presses and clicks to musical notes
  const noteMap: { [key: string]: Note } = {
    z: { note: "C", sound: "/notes/piano/c.mp3" },
    x: { note: "D", sound: "/notes/piano/d.mp3" },
    c: { note: "E", sound: "/notes/piano/e.mp3" },
    v: { note: "F", sound: "/notes/piano/f.mp3" },
    b: { note: "G", sound: "/notes/piano/g.mp3" },
    n: { note: "A", sound: "/notes/piano/a.mp3" },
    m: { note: "B", sound: "/notes/piano/b.mp3" },
  };

  // Handle key press event
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const noteInfo = noteMap[event.key];
      if (noteInfo && sequence.length < 5) {
        // Prevent adding more than 5 notes
        addNoteToSequence(noteInfo.note);
        playSound(noteInfo.sound);
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [sequence]);

  const playSound = (soundFile: string) => {
    const audio = new Audio(soundFile);
    audio.volume = 0.2; // Set the volume to 20% (adjust as needed)
    audio.play();
  };

  // Function to add notes to the sequence (up to 5 notes)
  const addNoteToSequence = (note: string) => {
    setSequence((prevSequence) => {
      if (prevSequence.length < 5) {
        return [...prevSequence, note];
      } else {
        return prevSequence; // Prevent adding more than 5 notes
      }
    });
  };

  // Function to reset the sequence
  const resetSequence = () => {
    setSequence([]); // Reset the sequence to an empty array
  };

  const resetGame = () => {
    setPlayer1Sequence([]);
    setPlayer2Sequence([]);
    resetSequence();
  };

  const handleSubmit = () => {
    if (sequence.length === 5) {
      if (isCreating) {
        // If the current player is creating
        if (currentPlayer === 1) {
          setPlayer1Sequence(sequence); // Store Player 1's sequence
        } else {
          setPlayer2Sequence(sequence); // Store Player 2's sequence
        }
      } else {
        // If the current player is matching
        if (currentPlayer === 1) {
          // Player 1 is matching Player 2's sequence
          if (sequence.join("") === player2Sequence.join("")) {
            setPlayer1Score((prevScore) => prevScore + 5); // Increase Player 1's score by 5 if sequences match
          }
        } else {
          // Player 2 is matching Player 1's sequence
          if (sequence.join("") === player1Sequence.join("")) {
            setPlayer2Score((prevScore) => prevScore + 5); // Increase Player 2's score by 5 if sequences match
          }
        }
      }

      // After submission, reset the sequence for the next turn
      resetSequence();

      // Switch the current player and toggle between creating and matching
      setCurrentPlayer((prevPlayer) => (prevPlayer === 1 ? 2 : 1));
      setIsCreating((prevIsCreating) => !prevIsCreating);
    }
  };

  return (
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
            <div className="timer">19</div>
          </div>
          <div className="turn-pointer">
            {currentPlayer === 1 ? (
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
        <p className="status">Player1's creating a sequence...</p>
        <div className="sequence-boxes">
          {sequence.map((note, index) => (
            <div key={index} className={`sequence note`}>
              {note} {/* Render only the note string */}
            </div>
          ))}
          {/* Empty boxes for remaining sequence slots */}
          {Array(5 - sequence.length)
            .fill("")
            .map((_, index) => (
              <div key={index + sequence.length} className="sequence"></div>
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
          <div
            className="white-key"
            onClick={() => {
              addNoteToSequence("C");
              playSound("/notess/c.mp3");
            }}
          >
            C
          </div>
          <div
            className="white-key"
            onClick={() => {
              addNoteToSequence("D");
              playSound("/notess/d.mp3");
            }}
          >
            D
          </div>
          <div
            className="white-key"
            onClick={() => {
              addNoteToSequence("E");
              playSound("/notess/e.mp3");
            }}
          >
            E
          </div>
          <div
            className="white-key"
            onClick={() => {
              addNoteToSequence("F");
              playSound("/notess/f.mp3");
            }}
          >
            F
          </div>
          <div
            className="white-key"
            onClick={() => {
              addNoteToSequence("G");
              playSound("/notess/g.mp3");
            }}
          >
            G
          </div>
          <div
            className="white-key"
            onClick={() => {
              addNoteToSequence("A");
              playSound("/notess/a.mp3");
            }}
          >
            A
          </div>
          <div
            className="white-key"
            onClick={() => {
              addNoteToSequence("B");
              playSound("/notess/b.mp3");
            }}
          >
            B
          </div>
        </div>

        <button className="reset" onClick={resetSequence}>
          Reset
        </button>
      </div>
    </div>
  );
};

export default Piano;
