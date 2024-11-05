import React from 'react';
import './BackgroundChange.css';
import { useNavigate } from 'react-router-dom';

const BackgroundChange: React.FC = () => {
    const changeBackground = (className: string) => {
        // Remove any existing background classes on the body
        document.body.classList.remove('background-1', 'background-2', 'background-3');
        
        // Add the selected background class
        document.body.classList.add(className);
    };
    const navigate = useNavigate();

    return (
        <div className="background-selector">
            <div className="select-title">Choose your background</div>
            <div className="background-options">
                <div
                    className="background-preview"
                    style={{ backgroundImage: "url('/background_image/background1_0.png')" }}
                    onClick={() => changeBackground('background-1')}
                />
                <div
                    className="background-preview"
                    style={{ backgroundImage: "url('/background_image/background2_0.png')" }}
                    onClick={() => changeBackground('background-3')}
                />
                <div
                    className="background-preview"
                    style={{ backgroundImage: "url('/background_image/background3_0.png')" }}
                    onClick={() => changeBackground('background-2')}
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

export default BackgroundChange;
