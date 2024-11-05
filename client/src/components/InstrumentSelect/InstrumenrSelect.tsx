import React, { useEffect, useState } from "react";
import socket from "../../socket";
import "./InstrumentSelect.css";

function InstrumentSelect() {
  const handleInstrumentClick = (instrument: string) => {
    socket.emit("update_instrument", instrument);
  };

  return (
    <>
      <div className="instrument-container">
        <div className="instrument-title">Instrument: </div>
        <div className="instrument-button">
          <button onClick={() => handleInstrumentClick("piano")}>Piano</button>

          <button onClick={() => handleInstrumentClick("trumpet")}>
            Trumpet
          </button>

          <button onClick={() => handleInstrumentClick("guitar")}>
            Guitar
          </button>
        </div>
      </div>
    </>
  );
}

export default InstrumentSelect;
