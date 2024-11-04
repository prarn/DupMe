import React, { useEffect, useState } from "react";
import socket from "../../socket";
import "./InstrumentSelect.css";

function InstrumentSelect() {
  return (
    <>
      <div className="instrument-container">
        <div className="instrument-title">Instrument: </div>
        <div className="instrument-button">
          <button>Piano</button>
          <button>Trumpet</button>
          <button>Guitar</button>
        </div>
      </div>
    </>
  );
}

export default InstrumentSelect;
