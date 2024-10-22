import React, { useState } from "react";
import "./InLobby.css";
import { Link } from "react-router-dom";

const InLobby: React.FC = () => {
  const [isReady, setIsReady] = useState(false);

  return (
    <div className="inlobby-container">
      {/* Player 1 Card (Left Side) */}
      <div className="player-card">
        <h2>Player 1</h2>
        <div className="instrument-placeholder">
          {isReady ? (
            <img
              src="/Instruments/trumpet.png"
              alt="Instrument"
              className="instrument-icon"
            />
          ) : (
            <Link to="/select">
              <img
                src="/rooms_image/instrument.png"
                alt="Instrument"
                className="instrument-icon"
              />
            </Link>
          )}
        </div>
        <p className={isReady ? "status-ready" : "status-not-ready"}>
          {isReady ? "Ready" : "Not ready"}
        </p>
      </div>

      {/* Center Buttons */}
      <div className="center-controls">
        <img
          className="ready-button"
          src="./homepage_image/ready.png"
          alt="ready-button"
          onClick={() => setIsReady(!isReady)}
        />
        <p className="wait-text">wait till both players ready</p>
        <img
          className="howtoplay-button"
          src="./homepage_image/how_to_play.png"
          alt="howtoplay-button"
        />
      </div>

      {/* Player 1 Card (Right Side) */}
      <div className="player-card">
        <h2>Player 2</h2>
        <div className="instrument-placeholder">
          {isReady ? (
            <img
              src="/Instruments/trumpet.png"
              alt="Instrument"
              className="instrument-icon"
            />
          ) : (
            <Link to="/select">
              <img
                src="/rooms_image/instrument.png"
                alt="Instrument"
                className="instrument-icon"
              />
            </Link>
          )}
        </div>
        <p className={isReady ? "status-ready" : "status-not-ready"}>
          {isReady ? "Ready" : "Not ready"}
        </p>
      </div>
    </div>
  );
};

export default InLobby;
