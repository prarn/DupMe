import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "./HowToPlay.css";

const HowToPlay = () => {
  const navigate = useNavigate();

  return (
    <div className="howtoplay-logo">
      <div>
        <Link to="/">
          <img
            src="/homepage_image/howtoplay.png"
            alt="howtoplay"
            className="howtoplay-logo"
          />
        </Link>
      </div>
      <div>
        <Link to="/">
          <img
            src="/homepage_image/howtoplaydetail.png"
            alt="howtoplaydetail"
            className="howtoplaydetail-logo"
          />
        </Link>
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

export default HowToPlay;
