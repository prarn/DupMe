import React from 'react';
import { useNavigate } from 'react-router-dom';
import './select.css';

const Select = () => {
  const navigate = useNavigate();

  const handleInstrumentClick = (instrument) => {
    navigate('/how-to-play', { state: { instrument } });
  };

  return (
    <div className="select-container">
      <div className="select-title">Choose your instrument</div>
     
        <div className="instrument-selection">
          <img
            src="/Instruments/guitar.png"
            alt="Guitar"
            className="instrument-image"
            onClick={() => handleInstrumentClick('guitar')}
          />
          <img
            src="/Instruments/trumpet.png"
            alt="Trumpet"
            className="instrument-image"
            onClick={() => handleInstrumentClick('trumpet')}
          />
          <img
            src="/Instruments/piano.png"
            alt="Piano"
            className="instrument-image"
            onClick={() => handleInstrumentClick('piano')}
          />
        </div>
      
    </div>
  );
};

export default Select;

