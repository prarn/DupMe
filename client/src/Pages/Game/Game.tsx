import "./Game.css";
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

      </div>
    </>
  );
}

export default Game;