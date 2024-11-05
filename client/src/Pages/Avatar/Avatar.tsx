import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Avatar.css';
import socket from '../../socket';

const Select: React.FC = () => {
  const navigate = useNavigate();

  // Specify the type of 'avatar' as string
  const handleAvatarClick = (avatar: string) => {
    navigate('/game', { state: { avatar } });
    socket.emit('update_avatar', avatar); // Emit avatar selection to the server
  };

  return (
    <div className="avatar-container">
      <div className="avatar-title">Choose your avatar</div>
      
      <div className="avatar-selection">
        <img
          src="/avatar_image/avatar1.png"
          alt="avatar1"
          className="avatar-image"
          onClick={() => handleAvatarClick('avatar1')}
        />
        <img
          src="/avatar_image/avatar2.png"
          alt="avatar2"
          className="avatar-image"
          onClick={() => handleAvatarClick('avatar2')}
        />
        <img
          src="/avatar_image/avatar3.png"
          alt="avatar3"
          className="avatar-image"
          onClick={() => handleAvatarClick('avatar3')}
        />
        <img
          src="/avatar_image/avatar4.png"
          alt="avatar4"
          className="avatar-image"
          onClick={() => handleAvatarClick('avatar4')}
        />
      </div>
    </div>
  );
};

export default Select;

