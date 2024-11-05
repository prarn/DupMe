import React from 'react';
import { useNavigate } from 'react-router-dom';
import './select.css';

const Select: React.FC = () => {
  const navigate = useNavigate();

  // Specify the type of 'instrument' as string
  const handleInstrumentClick = (instrument: string) => {
    navigate('/soundtesting', { state: { instrument } });
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
      <div className="menu">
        <img
          src="/MainMenu.png"
          alt="menu"
          className="menu-button"
          onClick={() => navigate('/')}  
        />
      </div>
    </div>
    
  );
};

export default Select;
