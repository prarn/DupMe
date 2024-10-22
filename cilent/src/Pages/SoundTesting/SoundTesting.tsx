import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // To get passed state
import './SoundTesting.css';

// Define the type for the location state, if it's coming from another route
interface LocationState {
  instrument?: 'guitar' | 'trumpet' | 'piano'; // Define possible instruments
}

const SoundTesting: React.FC = () => {
  const navigate = useNavigate();
  
  // Define the location state type when calling useLocation
  const location = useLocation();
  const { instrument } = (location.state as LocationState) || {}; // Safely extract instrument from state

  // Determine the instrument sound file path
  const instrumentSounds: Record<string, string> = {
    guitar: 'guitar', // Sound folder and prefix for guitar notes
    trumpet: 'trumpet', // Sound folder and prefix for trumpet notes
    piano: 'piano', // Sound folder and prefix for piano notes
  };

  // Set the instrument image and sound based on the selected instrument
  const instrumentImage = `/Instruments/${instrument || 'piano'}.png`;
  const selectedInstrument = instrumentSounds[instrument || 'piano'];

  // Function to handle key press and play the corresponding note
  const handleKeyPress = (event: KeyboardEvent) => {
    const keyToNote: Record<string, string> = {
      z: 'c',
      x: 'd',
      c: 'e',
      v: 'f',
      b: 'g',
      n: 'a',
      m: 'b',
    };

    const note = keyToNote[event.key];
    if (note) {
      const audio = new Audio(`/notes/${selectedInstrument}/${note}.mp3`); // Load based on selected instrument
      audio.volume = 0.2;
      audio.play();
    }
  };

  useEffect(() => {
    window.addEventListener('keypress', handleKeyPress);

    return () => {
      window.removeEventListener('keypress', handleKeyPress);
    };
  }, [selectedInstrument]); // Re-run when instrument changes

  return (
    <>
      <div className="container">
        <div>
          Press&nbsp;&nbsp;&nbsp;
          <span style={{ color: 'red' }}>z,x,c,v,b,n,m</span>&nbsp;&nbsp;&nbsp;to&nbsp;&nbsp;hear&nbsp;&nbsp;&nbsp;
          <span style={{ color: 'red' }}>c,d,e,f,g,a,b</span>&nbsp;&nbsp;&nbsp;notes
        </div>
        <div className="instrument">
          <img src={instrumentImage} alt={instrument || 'piano'} />
        </div>
      </div>

      <div className="menu">
        <img
          src="/MainMenu.png"
          alt="menu"
          className="menu-button"
          onClick={() => navigate('/')}  
        />
      </div>
    </>
  );
};

export default SoundTesting;
