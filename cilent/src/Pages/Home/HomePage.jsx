import React from 'react';
import { useNavigate } from 'react-router-dom';

import './App.css'; 

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="homepage">
      <div className="dupme-sign">
        <img src="/homepage_image/DupMe.png" alt="DupMe" className="dupme-logo" />
      </div>
      <div className="buttons">
        <img
          src="/homepage_image/ready.png"
          alt="Ready Button"
          className="ready-button"
          onClick={() => navigate('/game')}
        />
        <p className="wait-text">'Wait till both players ready'</p>
        <img
          src="/homepage_image/how_to_play.png"
          alt="How to Play Button"
          className="how-to-play-button"
          onClick={() => navigate('/select')}
        />
      </div>
    </div>
  );
};

export default HomePage;

