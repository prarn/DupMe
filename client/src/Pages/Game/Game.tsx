import "./Game.css";
import InstrumentSelect from "../../components/InstrumentSelect/InstrumenrSelect";
import Opponent from "../../components/Player/Opponent";
import Me from "../../components/Player/Me";
import PianoComponent from "../../components/PianoComponent/PianoComponent";
import Banner from "../../components/Banner/Banner";

function Game() {
  return (
    <>
      <div className="game-container">
        <div className="">
            <Banner />
        </div>

        <div className="header">
          <div className="me">
            <Me />
          </div>
          <div className="opponent">
            <Opponent />
          </div>
        </div>

        <div className="piano-component">
          <PianoComponent />
        </div>

        <div className="instrument-select">
          <InstrumentSelect />
        </div>
      </div>
    </>
  );
}

export default Game;

// const notes = ["C", "D", "E", "F", "G", "A", "B"];
// const [noteList, setNoteList] = useState<{ id: number; note: string }[]>([]);
// const [noteList_Received, setNoteList_Received] = useState<
//   { id: number; note: string }[]
// >([]);
// const [countdown, setCountdown] = useState(10);

// const [currentPlayer, setCurrentPlayer] = useState(true);

// const handleClickKeys = (item: string) => {
//   if (noteList.length < 5) {
//     setNoteList((prevNoteList) => {
//       const newNote = { id: noteList.length, note: item };
//       const newNoteList = [...prevNoteList, newNote];
//       console.log(newNote);
//       return newNoteList;
//     });
//     playSound(`/notes/piano/${item.toLowerCase()}.mp3`);
//   }
// };

// const playSound = (soundFile: string) => {
//   const audio = new Audio(soundFile);
//   audio.volume = 0.2;
//   audio.play();
// };

// const handleSubmit = () => {
//   if (currentPlayer) {
//     // Player 1's turn
//     if (noteList.length > 0) {
//       socket.emit("send_noteslist", noteList); // Send notes to server
//       setNoteList([]);
//     }
//   } else {
//     // Player 2's turn
//     handleSecondPlayerSubmit(); // Process Player 2's submission
//     // setCountdown(0); // Stop countdown for Player 2
//   }
// };

// const handleReset = () => {
//   setNoteList([]);
// };

// const handleCreate = () => {
//   setCountdown(10);
//   setNoteList([]);
//   setNoteList_Received([]);
//   socket.emit("start_game", { duration: 10 }); // Start game and initialize scores
// };

// const handleSecondPlayerSubmit = () => {
//   const pointsEarned = noteList.reduce((points, note, index) => {
//     return note.note === noteList_Received[index]?.note ? points + 1 : points;
//   }, 0);
//   socket.emit("score_points", pointsEarned); // Send points earned to server
//   setNoteList([]); // Reset the note list for the next round
// };

// useEffect(() => {
//   socket.on("countdown_update", (data) => {
//     setCountdown(data.countdown);
//   });

//   socket.on("countdown_finished", () => {
//     setCountdown(0);
//     if (currentPlayer) {
//       handleSubmit(); // Ends Player 1’s turn
//     } else {
//       handleSecondPlayerSubmit(); // Calculate and end Player 2’s turn
//     }
//   });

//   socket.on("current_player_updated", (isPlayer1) => {
//     setCurrentPlayer(isPlayer1); // Update the current player state
//     if (!isPlayer1) setCountdown(20); // Start 20 seconds for Player 2
//   });

//   return () => {
//     socket.off("countdown_update");
//     socket.off("countdown_finished");
//     socket.off("current_player_updated");
//   };
// });

// useEffect(() => {
//   const receiveNotes = (data: { id: number; note: string }[]) => {
//     setNoteList_Received(data);
//     console.log("Received notes:", data);
//   };

//   socket.on("receive_noteslist", receiveNotes);

//   return () => {
//     socket.off("receive_noteslist", receiveNotes);
//   };
// }, []);
